import { NextRequest, NextResponse } from 'next/server'

const CRM_API_URL = process.env.CRM_API_URL || 'http://crm-backend:8000/api'

export async function POST(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
        return NextResponse.json({ error: 'Token missing' }, { status: 400 })
    }

    try {
        const response = await fetch(`${CRM_API_URL}/site-customers/verify/${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })

        const data = await response.json()

        if (!response.ok) {
            return NextResponse.json(
                { error: data.detail || 'Verification failed' },
                { status: response.status }
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Verify error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
