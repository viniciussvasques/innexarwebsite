import { NextRequest, NextResponse } from 'next/server'

const CRM_API_URL = process.env.CRM_API_URL || 'http://crm-backend:8000/api'

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json()

        const response = await fetch(`${CRM_API_URL}/site-customers/forgot-password?email=${encodeURIComponent(email)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })

        // Always return success to prevent email enumeration
        return NextResponse.json({ message: 'If account exists, reset email sent' })
    } catch (error) {
        console.error('Forgot password error:', error)
        // Still return success for security
        return NextResponse.json({ message: 'If account exists, reset email sent' })
    }
}
