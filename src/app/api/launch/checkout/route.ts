import { NextRequest, NextResponse } from 'next/server'

// Base product
const BASE_PRODUCT = {
    name: 'Innexar Launch Site',
    description: 'Professional website delivered in 5 days',
    price: 39900, // $399 in cents
}

// Add-ons
const ADDONS: Record<string, { name: string; price: number; description: string }> = {
    logo: { name: 'Logo Design', price: 9900, description: 'Professional logo with 3 concepts' },
    seo: { name: 'SEO Local Pro', price: 14900, description: 'Advanced local SEO optimization' },
    'extra-page': { name: 'Extra Page', price: 7900, description: 'Additional custom page' },
    whatsapp: { name: 'WhatsApp Widget', price: 4900, description: 'Direct WhatsApp integration' },
    'google-business': { name: 'Google Business Setup', price: 4900, description: 'Complete GMB optimization' },
}

// Dynamically import Stripe only at runtime
async function getStripe() {
    const Stripe = (await import('stripe')).default
    const key = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder'
    return new Stripe(key, {
        apiVersion: '2025-12-15.clover' as const,
    })
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { addons = [], customerEmail } = body

        // Build line items
        const lineItems: Array<{
            price_data: {
                currency: string
                product_data: { name: string; description: string }
                unit_amount: number
            }
            quantity: number
        }> = [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: BASE_PRODUCT.name,
                            description: BASE_PRODUCT.description,
                        },
                        unit_amount: BASE_PRODUCT.price,
                    },
                    quantity: 1,
                },
            ]

        // Add selected add-ons
        for (const addonId of addons) {
            const addon = ADDONS[addonId]
            if (addon) {
                lineItems.push({
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: addon.name,
                            description: addon.description,
                        },
                        unit_amount: addon.price,
                    },
                    quantity: 1,
                })
            }
        }

        const stripe = await getStripe()

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${request.headers.get('origin')}/en/launch/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${request.headers.get('origin')}/en/launch`,
            customer_email: customerEmail || undefined,
            metadata: {
                addons: addons.join(','),
                product: 'launch_site',
            },
            // Collect billing address
            billing_address_collection: 'required',
            // Phone number
            phone_number_collection: {
                enabled: true,
            },
        })

        return NextResponse.json({
            sessionId: session.id,
            url: session.url,
        })
    } catch (error) {
        console.error('Stripe checkout error:', error)
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        )
    }
}

export async function GET() {
    return NextResponse.json({
        basePrice: BASE_PRODUCT.price / 100,
        addons: Object.entries(ADDONS).map(([id, addon]) => ({
            id,
            name: addon.name,
            price: addon.price / 100,
            description: addon.description,
        })),
    })
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
