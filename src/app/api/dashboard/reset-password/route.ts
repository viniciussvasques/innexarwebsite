import { NextRequest, NextResponse } from 'next/server'

const CRM_API_URL = process.env.CRM_API_URL || 'http://crm-backend:8000/api'

export async function POST(request: NextRequest) {
    try {
        const { token, new_password } = await request.json()

        const response = await fetch(`${CRM_API_URL}/site-customers/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, new_password }),
        })

        const data = await response.json()

        if (!response.ok) {
            return NextResponse.json(
                { error: data.detail || 'Reset failed' },
                { status: response.status }
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Reset password error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
