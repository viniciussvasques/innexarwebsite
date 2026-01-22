import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('order_id')
    const email = searchParams.get('email')

    if (!orderId || !email) {
        return NextResponse.json(
            { error: 'Missing order_id or email' },
            { status: 400 }
        )
    }

    try {
        // Fetch order from CRM API using public endpoint
        const crmUrl = process.env.CRM_API_URL || 'http://crm-backend:8000/api'
        const response = await fetch(`${crmUrl}/site-orders/public/${orderId}?email=${encodeURIComponent(email)}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            )
        }

        const order = await response.json()

        // Verify email matches (basic security)
        if (order.customer_email.toLowerCase() !== email.toLowerCase()) {
            return NextResponse.json(
                { error: 'Email does not match order' },
                { status: 403 }
            )
        }

        // Return sanitized order data (don't expose internal fields)
        return NextResponse.json({
            id: order.id,
            customer_name: order.customer_name,
            customer_email: order.customer_email,
            status: order.status,
            total_price: order.total_price,
            created_at: order.created_at,
            expected_delivery_date: order.expected_delivery_date,
            site_url: order.site_url,
            revisions_included: order.revisions_included,
            revisions_used: order.revisions_used,
            onboarding: order.onboarding ? {
                business_name: order.onboarding.business_name,
                primary_city: order.onboarding.primary_city,
                state: order.onboarding.state,
                primary_color: order.onboarding.primary_color,
                is_complete: order.onboarding.is_complete,
            } : null,
        })
    } catch (error) {
        console.error('Error fetching order status:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
