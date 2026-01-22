'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    Loader2, LogOut, User, Calendar, Clock, CheckCircle,
    Building2, Globe, MessageSquare, FileText
} from 'lucide-react'

interface Order {
    id: number
    customer_name: string
    customer_email: string
    status: string
    total_price: number
    expected_delivery_date: string | null
    site_url: string | null
    revisions_included: number
    revisions_used: number
    onboarding: {
        business_name: string
        primary_city: string
        state: string
    } | null
}

const statusLabels: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    'PAID': { label: 'Pagamento Confirmado', color: 'text-green-400', icon: <CheckCircle className="w-5 h-5" /> },
    'ONBOARDING_PENDING': { label: 'Aguardando Onboarding', color: 'text-yellow-400', icon: <FileText className="w-5 h-5" /> },
    'BUILDING': { label: 'Em Desenvolvimento', color: 'text-blue-400', icon: <Building2 className="w-5 h-5" /> },
    'REVIEW': { label: 'Pronto para Revisão', color: 'text-purple-400', icon: <MessageSquare className="w-5 h-5" /> },
    'DELIVERED': { label: 'Entregue', color: 'text-green-400', icon: <Globe className="w-5 h-5" /> },
}

export default function DashboardPage() {
    const router = useRouter()
    const [order, setOrder] = useState<Order | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('customer_token')
        const email = localStorage.getItem('customer_email')

        if (!token) {
            router.push('/dashboard/login')
            return
        }

        const fetchOrder = async () => {
            try {
                const response = await fetch(`/api/dashboard/me?token=${token}`)

                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('customer_token')
                        localStorage.removeItem('customer_email')
                        router.push('/dashboard/login')
                        return
                    }
                    throw new Error('Falha ao carregar projeto')
                }

                const data = await response.json()
                setOrder(data.order)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro ao carregar')
            } finally {
                setIsLoading(false)
            }
        }

        fetchOrder()
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem('customer_token')
        localStorage.removeItem('customer_email')
        router.push('/dashboard/login')
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
            </div>
        )
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Erro ao carregar</h2>
                    <p className="text-slate-400 mb-6">{error || 'Projeto não encontrado'}</p>
                    <button
                        onClick={handleLogout}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
                    >
                        Fazer login novamente
                    </button>
                </div>
            </div>
        )
    }

    const status = statusLabels[order.status] || { label: order.status, color: 'text-slate-400', icon: null }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Header */}
            <header className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Innexar
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-slate-400 text-sm hidden sm:block">
                            {order.customer_email}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="hidden sm:inline">Sair</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Welcome */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Olá, {order.customer_name}! 👋
                        </h1>
                        <p className="text-slate-400">
                            Acompanhe o progresso do seu projeto abaixo.
                        </p>
                    </div>

                    {/* Status Card */}
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`${status.color}`}>
                                {status.icon}
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Status Atual</p>
                                <p className={`text-xl font-semibold ${status.color}`}>
                                    {status.label}
                                </p>
                            </div>
                        </div>

                        {order.expected_delivery_date && (
                            <div className="flex items-center gap-2 text-slate-400">
                                <Calendar className="w-4 h-4" />
                                <span>Entrega prevista: {new Date(order.expected_delivery_date).toLocaleDateString('pt-BR')}</span>
                            </div>
                        )}
                    </div>

                    {/* Project Info */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        {/* Business Info */}
                        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-blue-400" />
                                Seu Negócio
                            </h2>
                            {order.onboarding ? (
                                <div className="space-y-3 text-slate-300">
                                    <p><strong>Nome:</strong> {order.onboarding.business_name}</p>
                                    <p><strong>Cidade:</strong> {order.onboarding.primary_city}</p>
                                    <p><strong>Estado:</strong> {order.onboarding.state}</p>
                                </div>
                            ) : (
                                <p className="text-slate-400">Preencha o onboarding para ver as informações</p>
                            )}
                        </div>

                        {/* Order Info */}
                        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-purple-400" />
                                Detalhes do Pedido
                            </h2>
                            <div className="space-y-3 text-slate-300">
                                <p><strong>Pedido #:</strong> {order.id}</p>
                                <p><strong>Valor:</strong> ${order.total_price}</p>
                                <p><strong>Revisões:</strong> {order.revisions_used}/{order.revisions_included} utilizadas</p>
                            </div>
                        </div>
                    </div>

                    {/* Site URL (if delivered) */}
                    {order.site_url && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
                            <h2 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2">
                                <Globe className="w-5 h-5" />
                                Seu Site Está no Ar! 🎉
                            </h2>
                            <a
                                href={order.site_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                Visitar Meu Site →
                            </a>
                        </div>
                    )}

                    {/* Support */}
                    <div className="mt-8 text-center text-slate-400">
                        <p>Precisa de ajuda? Entre em contato pelo chat ou email <a href="mailto:support@innexar.com" className="text-blue-400 hover:underline">support@innexar.com</a></p>
                    </div>
                </motion.div>
            </main>
        </div>
    )
}
