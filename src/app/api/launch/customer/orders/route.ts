import { NextRequest, NextResponse } from 'next/server'

const CRM_API_URL = process.env.CRM_API_URL || 'https://sales.innexar.app/api'

/**
 * Get orders for the logged-in customer using their JWT token
 */
export async function GET(request: NextRequest) {
    try {
        // Get token from Authorization header or query param
        const authHeader = request.headers.get('Authorization')
        const token = authHeader?.replace('Bearer ', '') || request.nextUrl.searchParams.get('token')

        if (!token) {
            return NextResponse.json({ error: 'Token required' }, { status: 401 })
        }

        // Call CRM API to get customer orders
        const response = await fetch(`${CRM_API_URL}/site-customers/me/orders`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            return NextResponse.json(
                { error: errorData.detail || 'Failed to fetch orders' },
                { status: response.status }
            )
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching customer orders:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
