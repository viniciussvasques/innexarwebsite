import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-12-15.clover',
})

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

        // Fallback for development/testing
        if (process.env.NODE_ENV === 'development') {
            return NextResponse.json({
                orderId: 'DEV-001',
                customerEmail: 'test@example.com',
                total: 399,
                status: 'paid',
            })
        }

        return NextResponse.json(
            { error: 'Failed to fetch session' },
            { status: 500 }
        )
    }
}
