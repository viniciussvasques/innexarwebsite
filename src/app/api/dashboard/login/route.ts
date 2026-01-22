import { NextRequest, NextResponse } from 'next/server'

const CRM_API_URL = process.env.CRM_API_URL || 'http://crm-backend:8000/api'

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        const response = await fetch(`${CRM_API_URL}/site-customers/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })

        const data = await response.json()

        if (!response.ok) {
            return NextResponse.json(
                { error: data.detail || 'Login failed' },
                { status: response.status }
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
