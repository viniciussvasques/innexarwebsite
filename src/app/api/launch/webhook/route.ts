import { NextRequest, NextResponse } from 'next/server'
import { getStripeSecretKey, getStripeWebhookSecret } from '@/lib/system-config'

// CRM API endpoint
const CRM_API_URL = process.env.CRM_API_URL || 'https://sales.innexar.app/api'

// Dynamically import Stripe only at runtime
async function getStripe() {
    const Stripe = (await import('stripe')).default
    const key = await getStripeSecretKey()
    return new Stripe(key, {
        apiVersion: '2025-12-15.clover' as const,
    })
}

export async function POST(request: NextRequest) {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
        console.error('Webhook: No signature provided')
        return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    console.log('Webhook: Received request with signature')

    const webhookSecret = await getStripeWebhookSecret()
    console.log('Webhook: Got secret, length:', webhookSecret?.length || 0)

    try {
        const stripe = await getStripe()
        const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
        console.log('Webhook: Event verified -', event.type)

        // Handle events
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object

                // Create order in CRM
                try {
                    const orderResponse = await fetch(`${CRM_API_URL}/site-orders`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            customer_name: session.customer_details?.name || 'Customer',
                            customer_email: session.customer_details?.email || '',
                            customer_phone: session.customer_details?.phone || '',
                            stripe_session_id: session.id,
                            stripe_customer_id: session.customer as string,
                            total_price: (session.amount_total || 0) / 100,
                            addon_ids: parseAddons(session.metadata?.addons || ''),
                        }),
                    })

                    if (orderResponse.ok) {
                        const orderData = await orderResponse.json()
                        console.log('Order created:', orderData.id)

                        // Send payment confirmation email
                        try {
                            await fetch(`${CRM_API_URL}/emails/send-payment-confirmation/${orderData.id}`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                            })
                            console.log('Payment confirmation email sent for order:', orderData.id)
                        } catch (emailError) {
                            console.error('Failed to send confirmation email:', emailError)
                        }
                    } else {
                        const errorText = await orderResponse.text()
                        console.error('Failed to create order in CRM:', orderResponse.status, errorText)
                    }
                } catch (error) {
                    console.error('Error calling CRM API:', error)
                }

                break
            }

            case 'payment_intent.succeeded': {
                console.log('Payment succeeded:', event.data.object.id)
                break
            }

            case 'payment_intent.payment_failed': {
                console.log('Payment failed:', event.data.object.id)
                break
            }

            default:
                console.log(`Unhandled event type: ${event.type}`)
        }

        return NextResponse.json({ received: true })
    } catch (err) {
        console.error('Webhook error:', err)
        return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
    }
}

function parseAddons(addonsString: string): number[] {
    // For now, return empty array since we need to map addon slugs to IDs
    return []
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
