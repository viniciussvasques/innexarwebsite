'use client'

import { useEffect, useState } from 'react'
import { useRouter, Link } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
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

export default function DashboardPage() {
    const t = useTranslations('dashboard')
    const router = useRouter()
    const [order, setOrder] = useState<Order | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    const statusLabels: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
        'PAID': { label: t('status.paid'), color: 'text-green-400', icon: <CheckCircle className="w-5 h-5" /> },
        'ONBOARDING_PENDING': { label: t('status.onboarding'), color: 'text-yellow-400', icon: <FileText className="w-5 h-5" /> },
        'BUILDING': { label: t('status.building'), color: 'text-blue-400', icon: <Building2 className="w-5 h-5" /> },
        'REVIEW': { label: t('status.review'), color: 'text-purple-400', icon: <MessageSquare className="w-5 h-5" /> },
        'DELIVERED': { label: t('status.delivered'), color: 'text-green-400', icon: <Globe className="w-5 h-5" /> },
    }

    useEffect(() => {
        const token = localStorage.getItem('customer_token')
        const email = localStorage.getItem('customer_email')

        if (!token) {
            router.push('/launch/login')
            return
        }

        const fetchOrder = async () => {
            try {
                const response = await fetch(`/api/dashboard/me?token=${token}`)

                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('customer_token')
                        localStorage.removeItem('customer_email')
                        router.push('/launch/login')
                        return
                    }
                    throw new Error(t('error.fetch'))
                }

                const data = await response.json()
                setOrder(data.order)
            } catch (err) {
                setError(err instanceof Error ? err.message : t('error.generic'))
            } finally {
                setIsLoading(false)
            }
        }

        fetchOrder()
    }, [router, t])

    const handleLogout = () => {
        localStorage.removeItem('customer_token')
        localStorage.removeItem('customer_email')
        router.push('/launch/login')
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
            </div>
        )
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">{t('error.title')}</h2>
                    <p className="text-slate-400 mb-6">{error || t('error.notFound')}</p>
                    <button
                        onClick={handleLogout}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        {t('error.retry')}
                    </button>
                </div>
            </div>
        )
    }

    const status = statusLabels[order.status] || { label: order.status, color: 'text-slate-400', icon: null }

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Background Decor */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/30 rounded-full blur-[120px]" />
            </div>

            {/* Header */}
            <header className="relative z-10 bg-slate-900/50 backdrop-blur-xl border-b border-white/5">
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
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-white/5"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="hidden sm:inline">{t('header.logout')}</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-6xl mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Welcome */}
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold text-white mb-2">
                            {t('welcome.greeting')}, {order.customer_name}! 👋
                        </h1>
                        <p className="text-slate-400 text-lg">
                            {t('welcome.subtitle')}
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Status Card and Project Info */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Status Card */}
                            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    {status.icon}
                                </div>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`p-3 rounded-2xl bg-white/5 ${status.color}`}>
                                        {status.icon}
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{t('status.label')}</p>
                                        <p className={`text-2xl font-bold ${status.color}`}>
                                            {status.label}
                                        </p>
                                    </div>
                                </div>

                                {order.expected_delivery_date && (
                                    <div className="flex items-center gap-3 text-slate-400 bg-white/5 w-fit px-4 py-2 rounded-full border border-white/5">
                                        <Calendar className="w-4 h-4 text-blue-400" />
                                        <span>{t('status.delivery')}: {new Date(order.expected_delivery_date).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>

                            {/* Project Info Cards */}
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Business Info */}
                                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-blue-500/30 transition-colors">
                                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-blue-500/10">
                                            <Building2 className="w-5 h-5 text-blue-400" />
                                        </div>
                                        {t('business.title')}
                                    </h2>
                                    {order.onboarding ? (
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">{t('business.name')}</p>
                                                <p className="text-white font-medium">{order.onboarding.business_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">{t('business.location')}</p>
                                                <p className="text-white font-medium">{order.onboarding.primary_city}, {order.onboarding.state}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-slate-500">{t('business.pending')}</p>
                                    )}
                                </div>

                                {/* Order Info */}
                                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-purple-500/30 transition-colors">
                                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-purple-500/10">
                                            <FileText className="w-5 h-5 text-purple-400" />
                                        </div>
                                        {t('order.title')}
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500">{t('order.number')}</span>
                                            <span className="text-white font-mono">#{order.id}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500">{t('order.total')}</span>
                                            <span className="text-white font-bold">${order.total_price}</span>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs font-medium uppercase tracking-wider mb-2">
                                                <span className="text-slate-500">{t('order.revisions')}</span>
                                                <span className="text-white">{order.revisions_used}/{order.revisions_included}</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-purple-500 transition-all duration-1000"
                                                    style={{ width: `${(order.revisions_used / order.revisions_included) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar / Quick Actions */}
                        <div className="space-y-6">
                            {/* Site URL (if delivered) */}
                            {order.site_url ? (
                                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-3xl p-8 shadow-lg shadow-green-500/10">
                                    <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-3">
                                        <Globe className="w-6 h-6" />
                                        {t('success.title')}
                                    </h2>
                                    <p className="text-green-100/70 mb-8 font-medium">
                                        {t('success.message')}
                                    </p>
                                    <a
                                        href={order.site_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full bg-green-500 hover:bg-green-400 text-slate-950 font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-green-500/20"
                                    >
                                        {t('success.button')}
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                            ) : (
                                <div className="bg-blue-600/10 border border-blue-500/20 rounded-3xl p-8">
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-blue-400" />
                                        {t('actions.title')}
                                    </h3>
                                    <div className="space-y-3">
                                        <button disabled className="w-full text-left py-3 px-4 rounded-xl bg-white/5 text-slate-400 text-sm font-medium cursor-not-allowed border border-transparent">
                                            {t('actions.viewPreview')}
                                        </button>
                                        <button disabled className="w-full text-left py-3 px-4 rounded-xl bg-white/5 text-slate-400 text-sm font-medium cursor-not-allowed border border-transparent">
                                            {t('actions.requestChanges')}
                                        </button>
                                        <button disabled className="w-full text-left py-3 px-4 rounded-xl bg-white/5 text-slate-400 text-sm font-medium cursor-not-allowed border border-transparent">
                                            {t('actions.approveDesign')}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Support */}
                            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                                <h3 className="text-lg font-bold text-white mb-4">{t('support.title')}</h3>
                                <p className="text-slate-400 text-sm mb-6">
                                    {t('support.message')}
                                </p>
                                <div className="space-y-3">
                                    <a
                                        href="mailto:support@innexar.com"
                                        className="flex items-center gap-3 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                    >
                                        <div className="p-2 rounded-lg bg-blue-500/10">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        {t('support.email')}
                                    </a>
                                    <a
                                        href="https://wa.me/..."
                                        className="flex items-center gap-3 text-green-400 hover:text-green-300 font-medium transition-colors"
                                    >
                                        <div className="p-2 rounded-lg bg-green-500/10">
                                            <MessageSquare className="w-4 h-4" />
                                        </div>
                                        {t('support.whatsapp')}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    )
}

// Helper icons
function ArrowRight(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}

function Sparkles(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
        </svg>
    )
}

function Mail(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    )
}
