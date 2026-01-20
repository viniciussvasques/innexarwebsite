import { NextRequest, NextResponse } from 'next/server'

// CRM API endpoint
const CRM_API_URL = process.env.CRM_API_URL || 'https://sales.innexar.app/api'

export async function POST(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('order_id')

    if (!orderId) {
        return NextResponse.json(
            { error: 'Missing order_id parameter' },
            { status: 400 }
        )
    }

    try {
        const body = await request.json()

        // Submit onboarding data to CRM
        const response = await fetch(`${CRM_API_URL}/site-orders/${orderId}/onboarding`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })

        if (!response.ok) {
            const error = await response.json()
            return NextResponse.json(
                { error: error.detail || 'Failed to submit onboarding' },
                { status: response.status }
            )
        }

        const result = await response.json()

        // Send onboarding complete email
        try {
            await fetch(`${CRM_API_URL}/emails/send-onboarding-complete/${orderId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })
            console.log('Onboarding complete email sent for order:', orderId)
        } catch (emailError) {
            console.error('Failed to send onboarding complete email:', emailError)
        }

        return NextResponse.json({
            success: true,
            message: 'Onboarding submitted successfully',
            onboarding: result,
        })
    } catch (error) {
        console.error('Error submitting onboarding:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('order_id')

    if (!orderId) {
        return NextResponse.json(
            { error: 'Missing order_id parameter' },
            { status: 400 }
        )
    }

    try {
        // Get order details from CRM
        const response = await fetch(`${CRM_API_URL}/site-orders/${orderId}`)

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            )
        }

        const order = await response.json()

        return NextResponse.json({
            order_id: order.id,
            business_name: order.onboarding?.business_name || '',
            is_complete: order.onboarding?.is_complete || false,
            status: order.status,
        })
    } catch (error) {
        console.error('Error fetching onboarding:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
