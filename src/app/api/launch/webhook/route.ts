import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2025-12-15.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder'

// CRM API endpoint
const CRM_API_URL = process.env.CRM_API_URL || 'https://sales.innexar.app/api'

export async function POST(request: NextRequest) {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
        return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
        console.error('Webhook signature verification failed:', err)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle events
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session

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
                    console.error('Failed to create order in CRM')
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
}

function parseAddons(addonsString: string): number[] {
    // For now, return empty array since we need to map addon slugs to IDs
    // This will be implemented when we have the actual addon IDs
    return []
}

// Required for Stripe webhooks
export const dynamic = 'force-dynamic'
