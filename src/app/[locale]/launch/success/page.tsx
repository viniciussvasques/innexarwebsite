'use client'

import { useEffect, useState, Suspense, useRef } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    CheckCircle2, ArrowRight, Mail, Clock, Palette, Eye,
    Rocket, LayoutDashboard, Sparkles, RefreshCw
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { MetaPixel } from '@/lib/meta-pixel'

function SuccessContent() {
    const t = useTranslations('launch')
    const searchParams = useSearchParams()
    const router = useRouter()
    const sessionId = searchParams.get('session_id')
    const [orderDetails, setOrderDetails] = useState<{
        orderId: string
        customerEmail: string
        total: number
    } | null>(null)
    const [countdown, setCountdown] = useState(10)
    const hasFiredPurchase = useRef(false)

    useEffect(() => {
        if (sessionId) {
            // Fetch order details from session
            const fetchOrderDetails = async () => {
                try {
                    const response = await fetch(`/api/launch/session-order?session_id=${sessionId}`)
                    if (response.ok) {
                        const data = await response.json()
                        setOrderDetails(data)

                        // Track Purchase event (only once)
                        if (!hasFiredPurchase.current) {
                            hasFiredPurchase.current = true
                            MetaPixel.purchase({
                                value: data.total || 399,
                                currency: 'USD',
                                content_ids: ['professional-website'],
                                content_type: 'product',
                                content_name: 'Professional Website',
                                num_items: 1,
                                order_id: data.orderId,
                            })
                        }
                    }
                } catch (error) {
                    console.error('Error fetching order:', error)
                }
            }
            fetchOrderDetails()
        }

        // Auto-redirect countdown
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    router.push(`/launch/onboarding?order_id=${orderDetails?.orderId || 'new'}`)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [sessionId, router, orderDetails?.orderId])

    const steps = [
        { icon: CheckCircle2, title: t('success.timeline.step1'), desc: t('success.timeline.step1Desc'), done: true },
        { icon: Palette, title: t('success.timeline.step2'), desc: t('success.timeline.step2Desc'), current: true },
        { icon: Eye, title: t('success.timeline.step3'), desc: t('success.timeline.step3Desc') },
        { icon: Rocket, title: t('success.timeline.step4'), desc: t('success.timeline.step4Desc') },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-6">
            {/* Animated background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-500/20 rounded-full blur-3xl"
                />
            </div>

            <div className="relative z-10 max-w-lg w-full">
                {/* Success Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center"
                >
                    {/* Success Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                        className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <CheckCircle2 className="w-12 h-12 text-white" />
                        </motion.div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-bold text-white mb-3"
                    >
                        {t('success.title')}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-slate-300 mb-8"
                    >
                        {t('success.message')}
                    </motion.p>

                    {/* Mini Timeline */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex justify-between items-center mb-8 px-4"
                    >
                        {steps.map((step, i) => {
                            const StepIcon = step.icon
                            return (
                                <div key={i} className="flex flex-col items-center relative">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step.done
                                        ? 'bg-green-500'
                                        : step.current
                                            ? 'bg-blue-500 ring-4 ring-blue-500/30'
                                            : 'bg-white/10'
                                        }`}>
                                        <StepIcon className={`w-5 h-5 ${step.done || step.current ? 'text-white' : 'text-slate-500'}`} />
                                    </div>
                                    <span className={`text-xs ${step.current ? 'text-blue-400 font-medium' : 'text-slate-500'}`}>
                                        {step.title}
                                    </span>
                                </div>
                            )
                        })}
                    </motion.div>

                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 text-left"
                    >
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-400">{t('success.orderId')}</span>
                            <span className="text-white font-mono">{orderDetails?.orderId || 'Processing...'}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-400">Email</span>
                            <span className="text-white">{orderDetails?.customerEmail || '—'}</span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                            <span className="text-slate-400">Total Paid</span>
                            <span className="text-xl font-bold text-green-400">${orderDetails?.total || 399}</span>
                        </div>
                    </motion.div>

                    {/* Next Step */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="bg-blue-500/20 border border-blue-400/30 rounded-2xl p-5 mb-6"
                    >
                        <div className="flex items-center justify-center gap-2 text-blue-300 font-semibold mb-2">
                            <Clock className="w-5 h-5" />
                            Next Step: Complete Your Onboarding
                        </div>
                        <p className="text-sm text-blue-200/70 mb-4">
                            Tell us about your business so we can build your perfect website.
                        </p>

                        {/* Countdown */}
                        <div className="flex items-center justify-center gap-2 text-sm text-blue-300">
                            <span>Redirecting in</span>
                            <motion.span
                                key={countdown}
                                initial={{ scale: 1.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="font-bold text-lg w-6 text-center"
                            >
                                {countdown}
                            </motion.span>
                            <span>seconds...</span>
                        </div>
                    </motion.div>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="space-y-3"
                    >
                        <Link
                            href={`/launch/onboarding?order_id=${orderDetails?.orderId || 'new'}`}
                            className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl font-bold text-white shadow-lg shadow-blue-500/25 transition-all"
                        >
                            {t('success.continueButton')}
                            <ArrowRight className="w-5 h-5" />
                        </Link>

                        {orderDetails && (
                            <Link
                                href={`/launch/dashboard?order_id=${orderDetails.orderId}&email=${encodeURIComponent(orderDetails.customerEmail)}`}
                                className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl font-medium text-slate-300 transition-all"
                            >
                                <LayoutDashboard className="w-5 h-5" />
                                {t('success.dashboardLink')}
                            </Link>
                        )}
                    </motion.div>
                </motion.div>

                {/* Footer note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center mt-6 space-y-2"
                >
                    <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
                        <Mail className="w-4 h-4" />
                        A confirmation email has been sent to your inbox.
                    </div>
                    <div className="flex items-center justify-center gap-2 text-slate-600 text-xs">
                        <Sparkles className="w-4 h-4" />
                        Powered by Innexar
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
        }>
            <SuccessContent />
        </Suspense>
    )
}
