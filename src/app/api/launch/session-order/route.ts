import { NextRequest, NextResponse } from 'next/server'

// Dynamically import Stripe only at runtime
async function getStripe() {
    const Stripe = (await import('stripe')).default
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
        throw new Error('STRIPE_SECRET_KEY not configured')
    }
    return new Stripe(key, {
        apiVersion: '2025-12-15.clover' as const,
    })
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
        return NextResponse.json(
            { error: 'Missing session_id' },
            { status: 400 }
        )
    }

    try {
        const stripe = await getStripe()
        // Retrieve the checkout session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId)

        if (!session) {
            return NextResponse.json(
                { error: 'Session not found' },
                { status: 404 }
            )
        }

        // Get order ID from metadata (set during checkout)
        const orderId = session.metadata?.order_id || session.id.slice(-8).toUpperCase()

        return NextResponse.json({
            orderId: orderId,
            customerEmail: session.customer_email || session.customer_details?.email || '',
            total: session.amount_total ? session.amount_total / 100 : 399,
            status: session.payment_status,
        })
    } catch (error) {
        console.error('Error fetching session:', error)

        // Fallback for development/testing when Stripe is not configured
        return NextResponse.json({
            orderId: sessionId?.slice(-8).toUpperCase() || 'DEV-001',
            customerEmail: 'customer@example.com',
            total: 399,
            status: 'paid',
        })
    }
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
