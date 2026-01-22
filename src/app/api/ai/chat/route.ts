import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, language, context } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      )
    }

    // URL da API do CRM (endpoint público)
    const crmApiUrl = process.env.CRM_API_URL || 'https://sales.innexar.app/api'

    // Fazer requisição para o CRM (endpoint público)
    const response = await fetch(`${crmApiUrl}/ai/public/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        language: language || 'pt',
        context: {
          ...context,
          source: 'website',
          timestamp: new Date().toISOString()
        }
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Erro na API do CRM:', errorData)
      return NextResponse.json(
        { error: 'Erro ao comunicar com a IA' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Erro ao processar chat:', error)
    return NextResponse.json(
      { error: 'Erro ao processar sua mensagem. Tente novamente.' },
      { status: 500 }
    )
  }
}

