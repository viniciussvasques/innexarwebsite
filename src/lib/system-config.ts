// Fetches system configuration from CRM/Backend
const CRM_API_URL = process.env.CRM_API_URL || 'https://sales.innexar.app/api'

export interface SystemConfig {
    stripe_secret_key?: string
    stripe_publishable_key?: string
    stripe_webhook_secret?: string
    site_base_price?: number
    site_delivery_days?: number
}

let cachedConfig: SystemConfig | null = null
let cacheTimestamp: number = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function getSystemConfig(): Promise<SystemConfig> {
    const now = Date.now()

    // Return cached config if still valid
    if (cachedConfig && (now - cacheTimestamp) < CACHE_TTL) {
        return cachedConfig
    }

    try {
        const response = await fetch(`${CRM_API_URL}/system-config/public`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            next: { revalidate: 300 }, // Cache for 5 minutes
        })

        if (!response.ok) {
            console.error('Failed to fetch system config:', response.status)
            // Return fallback from environment variables
            return getFallbackConfig()
        }

        const configs = await response.json()

        // Transform array of configs to object
        const configMap: SystemConfig = {}
        for (const config of configs) {
            if (config.key === 'stripe_secret_key' && config.value) {
                configMap.stripe_secret_key = config.value
            } else if (config.key === 'stripe_publishable_key' && config.value) {
                configMap.stripe_publishable_key = config.value
            } else if (config.key === 'stripe_webhook_secret' && config.value) {
                configMap.stripe_webhook_secret = config.value
            } else if (config.key === 'site_base_price' && config.value) {
                configMap.site_base_price = parseFloat(config.value)
            } else if (config.key === 'site_delivery_days' && config.value) {
                configMap.site_delivery_days = parseInt(config.value)
            }
        }

        cachedConfig = configMap
        cacheTimestamp = now

        return configMap
    } catch (error) {
        console.error('Error fetching system config:', error)
        return getFallbackConfig()
    }
}

function getFallbackConfig(): SystemConfig {
    return {
        stripe_secret_key: process.env.STRIPE_SECRET_KEY,
        stripe_publishable_key: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
        site_base_price: 399,
        site_delivery_days: 5,
    }
}

export async function getStripeSecretKey(): Promise<string> {
    const config = await getSystemConfig()
    const key = config.stripe_secret_key || process.env.STRIPE_SECRET_KEY

    if (!key || key.includes('placeholder')) {
        throw new Error('Stripe secret key not configured. Please configure it in CRM Settings.')
    }

    return key
}

export async function getStripeWebhookSecret(): Promise<string> {
    const config = await getSystemConfig()
    return config.stripe_webhook_secret || process.env.STRIPE_WEBHOOK_SECRET || ''
}
