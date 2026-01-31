'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Check, X, Star, Clock, Shield, Zap, Sparkles, Rocket,
    ChevronRight, Play, TrendingUp, Award, Users, Globe
} from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { MetaPixel } from '@/lib/meta-pixel'
import Header from '@/components/Header'

// Addons matching the current launch page
const ADDONS = [
    { id: 'logo-premium', price: 99 },
    { id: 'seo', price: 149 },
    { id: 'extra-page', price: 79 },
    { id: 'whatsapp', price: 49 },
    { id: 'google-business', price: 49 },
]

// Countdown timer component
function CountdownTimer() {
    const t = useTranslations('promo.urgency')
    const [timeLeft, setTimeLeft] = useState({
        hours: 23,
        minutes: 59,
        seconds: 59
    })

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { hours, minutes, seconds } = prev

                if (seconds > 0) {
                    seconds--
                } else if (minutes > 0) {
                    minutes--
                    seconds = 59
                } else if (hours > 0) {
                    hours--
                    minutes = 59
                    seconds = 59
                } else {
                    // Reset timer to create urgency
                    hours = 23
                    minutes = 59
                    seconds = 59
                }

                return { hours, minutes, seconds }
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const pad = (num: number) => num.toString().padStart(2, '0')

    return (
        <div className="flex items-center justify-center gap-4">
            {[
                { label: t('hours'), value: timeLeft.hours },
                { label: t('minutes'), value: timeLeft.minutes },
                { label: t('seconds'), value: timeLeft.seconds }
            ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                    <div className="bg-white text-slate-900 rounded-lg px-4 py-3 min-w-[70px] text-center shadow-lg">
                        <div className="text-3xl font-bold tabular-nums">{pad(item.value)}</div>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{item.label}</div>
                </div>
            ))}
        </div>
    )
}

// Exit intent popup
function ExitIntentPopup({ onClose, onClaim }: { onClose: () => void; onClaim: () => void }) {
    const t = useTranslations('promo.exitIntent')
    const [countdown, setCountdown] = useState(600) // 10 minutes

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => prev > 0 ? prev - 1 : 0)
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const minutes = Math.floor(countdown / 60)
    const seconds = countdown % 60

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-slate-900 to-blue-950 border-2 border-yellow-400 rounded-2xl p-8 max-w-md w-full relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-slate-900" />
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-2">{t('title')}</h2>
                    <p className="text-xl text-yellow-400 mb-6">{t('subtitle')}</p>

                    <div className="bg-white/10 border border-white/20 rounded-xl p-6 mb-6">
                        <div className="flex items-baseline justify-center gap-2 mb-2">
                            <span className="text-2xl text-slate-400 line-through">{t('originalPrice')}</span>
                            <span className="text-5xl font-bold text-white">{t('newPrice')}</span>
                        </div>
                        <div className="bg-yellow-400 text-slate-900 font-bold px-4 py-2 rounded-lg inline-block">
                            {t('code')}
                        </div>
                    </div>

                    <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-3 mb-6">
                        <p className="text-red-300 text-sm font-medium">{t('expires')}</p>
                        <div className="text-2xl font-bold text-white mt-1">
                            {minutes}:{seconds.toString().padStart(2, '0')}
                        </div>
                    </div>

                    <button
                        onClick={onClaim}
                        className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold py-4 rounded-xl text-lg transition-all shadow-lg shadow-yellow-400/50 mb-3"
                    >
                        {t('cta')}
                    </button>

                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors text-sm"
                    >
                        {t('close')}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}

// Sticky CTA Bar
function StickyCTA({ price, onCheckout, isVisible }: { price: number; onCheckout: () => void; isVisible: boolean }) {
    const t = useTranslations('promo.sticky')

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-white/10 z-50 shadow-2xl"
                >
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-white">{t('price')}</span>
                                <span className="text-sm text-slate-400 line-through">{t('was')}</span>
                            </div>
                            <button
                                onClick={onCheckout}
                                className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-8 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg"
                            >
                                {t('cta')}
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default function PromoPageClient() {
    const t = useTranslations('promo')
    const locale = useLocale()
    const [selectedAddons, setSelectedAddons] = useState<string[]>([])
    const [isCheckingOut, setIsCheckingOut] = useState(false)
    const [showExitPopup, setShowExitPopup] = useState(false)
    const [hasShownExitPopup, setHasShownExitPopup] = useState(false)
    const [showStickyCTA, setShowStickyCTA] = useState(false)
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)

    const basePrice = 399
    const addonsTotal = selectedAddons.reduce((sum, id) => {
        const addon = ADDONS.find(a => a.id === id)
        return sum + (addon?.price || 0)
    }, 0)
    const totalPrice = basePrice + addonsTotal

    // Track page view
    useEffect(() => {
        try {
            MetaPixel.viewContent({
                content_name: 'Promo Landing Page - $399 Website',
                content_category: 'Website Services',
                content_type: 'product',
                value: 399,
                currency: 'USD',
            })
        } catch (e) {
            console.warn('Meta Pixel tracking failed:', e)
        }

        // Google Analytics
        try {
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'page_view', {
                    page_title: 'Promo Landing Page',
                    page_location: window.location.href,
                    page_path: window.location.pathname,
                })
            }
        } catch (e) {
            console.warn('Google Analytics tracking failed:', e)
        }
    }, [])

    // Exit intent detection
    useEffect(() => {
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !hasShownExitPopup && !showExitPopup) {
                setShowExitPopup(true)
                setHasShownExitPopup(true)

                try {
                    MetaPixel.trackCustom('ExitIntentTriggered', {
                        value: totalPrice,
                        currency: 'USD'
                    })
                } catch (e) {
                    console.warn('Meta Pixel tracking failed:', e)
                }
            }
        }

        document.addEventListener('mouseleave', handleMouseLeave)
        return () => document.removeEventListener('mouseleave', handleMouseLeave)
    }, [hasShownExitPopup, showExitPopup, totalPrice])

    // Sticky CTA visibility
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY
            const heroHeight = 800 // Approximate hero height
            setShowStickyCTA(scrollPosition > heroHeight)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const toggleAddon = useCallback((id: string) => {
        const addon = ADDONS.find(a => a.id === id)
        if (addon) {
            if (!selectedAddons.includes(id)) {
                try {
                    MetaPixel.selectAddon(`addon-${id}`, addon.price)
                } catch (e) {
                    console.warn('Meta Pixel tracking failed:', e)
                }
            }
        }
        setSelectedAddons(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        )
    }, [selectedAddons])

    const handleCheckout = async (couponCode?: string) => {
        setIsCheckingOut(true)

        // Track checkout initiation (safe call)
        try {
            MetaPixel.initiateCheckout({
                value: totalPrice,
                currency: 'USD',
                content_ids: ['professional-website-promo', ...selectedAddons],
                content_type: 'product',
                num_items: 1 + selectedAddons.length,
            })
        } catch (e) {
            console.warn('Meta Pixel tracking failed:', e)
        }

        // Google Analytics (safe call)
        try {
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'begin_checkout', {
                    value: totalPrice,
                    currency: 'USD',
                    items: [{
                        item_id: 'professional-website-promo',
                        item_name: 'Professional Website - Promo',
                        price: basePrice,
                        quantity: 1
                    }]
                })
            }
        } catch (e) {
            console.warn('Google Analytics tracking failed:', e)
        }

        try {
            const requestBody: any = {
                addons: selectedAddons,
                source: 'promo-page',
                locale,
            }

            // Add coupon if provided
            if (couponCode) {
                requestBody.couponCode = couponCode
            }

            const response = await fetch(`/api/launch/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            })

            if (!response.ok) {
                throw new Error(`Checkout failed: ${response.status}`)
            }

            const data = await response.json()
            if (data.url) {
                window.location.href = data.url
            } else {
                throw new Error('No checkout URL received')
            }
        } catch (error) {
            console.error('Checkout error:', error)
            alert('Checkout error. Please try again or contact support.')
            setIsCheckingOut(false)
        }
    }

    const handleExitPopupClaim = () => {
        try {
            MetaPixel.trackCustom('ExitPopupClaimed', {
                value: 349,
                currency: 'USD'
            })
        } catch (e) {
            console.warn('Meta Pixel tracking failed:', e)
        }
        setShowExitPopup(false)
        setAppliedCoupon('SAVE50')
        handleCheckout('SAVE50')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
            <Header />

            {/* Background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Hero Section */}
            <section className="relative z-10 pt-32 pb-20">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="inline-block mb-6"
                        >
                            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-full font-bold text-sm animate-pulse shadow-lg">
                                {t('hero.badge')}
                            </div>
                        </motion.div>

                        {/* Title */}
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                                {t('hero.title')}
                            </span>
                        </h1>

                        <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-4">
                            {t('hero.subtitle')}
                        </div>

                        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                            {t('hero.description')}
                        </p>

                        {/* Price */}
                        <div className="bg-white/10 border-2 border-white/20 rounded-2xl p-8 mb-8 max-w-md mx-auto">
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <span className="text-3xl text-slate-400 line-through">{t('hero.originalPrice')}</span>
                                <span className="text-6xl font-bold text-white">{t('hero.price')}</span>
                            </div>
                            <div className="bg-green-500/20 border border-green-400 rounded-lg px-4 py-2 inline-block">
                                <span className="text-green-300 font-bold text-lg">{t('hero.savings')}</span>
                            </div>
                        </div>

                        {/* Urgency */}
                        <div className="bg-red-500/20 border border-red-400/50 rounded-xl p-4 mb-8 max-w-md mx-auto">
                            <p className="text-red-300 font-medium mb-1">⚡ {t('hero.urgency')}</p>
                        </div>

                        {/* CTA */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleCheckout()}
                            disabled={isCheckingOut}
                            className="bg-white hover:bg-slate-100 text-slate-900 font-bold text-xl px-12 py-5 rounded-xl flex items-center gap-3 mx-auto shadow-2xl shadow-white/20 transition-all disabled:opacity-50"
                        >
                            {isCheckingOut ? (
                                <>
                                    <div className="w-6 h-6 border-2 border-slate-400 border-t-slate-900 rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Rocket className="w-6 h-6" />
                                    {t('hero.cta')}
                                    <ChevronRight className="w-6 h-6" />
                                </>
                            )}
                        </motion.button>

                        <p className="text-sm text-slate-400 mt-4">
                            {t('hero.secure')} • {t('hero.guarantee')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Trust badges */}
            <section className="relative z-10 py-12 border-y border-white/10 bg-white/5">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        {[
                            { value: t('trust.stat1'), label: t('trust.stat1Label'), icon: Globe },
                            { value: t('trust.stat2'), label: t('trust.stat2Label'), icon: Star },
                            { value: t('trust.stat3'), label: t('trust.stat3Label'), icon: Clock },
                            { value: t('trust.stat4'), label: t('trust.stat4Label'), icon: Award }
                        ].map((stat, i) => {
                            const Icon = stat.icon
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                                    <div className="text-sm text-slate-400">{stat.label}</div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="relative z-10 py-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('benefits.title')}</h2>
                        <p className="text-xl text-slate-300">{t('benefits.subtitle')}</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <motion.div
                                key={num}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: num * 0.05 }}
                                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-blue-400/50 transition-colors"
                            >
                                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                                    <Check className="w-6 h-6 text-blue-400" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">{t(`benefits.benefit${num}.title`)}</h3>
                                <p className="text-slate-400 text-sm">{t(`benefits.benefit${num}.desc`)}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="max-w-2xl mx-auto mt-12 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-white/20 rounded-2xl p-8 text-center">
                        <div className="text-2xl text-slate-400 line-through mb-2">{t('benefits.totalValue')}</div>
                        <div className="text-4xl font-bold text-white mb-4">{t('benefits.yourPrice')}</div>
                        <button
                            onClick={() => handleCheckout()}
                            className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-8 py-4 rounded-xl transition-all"
                        >
                            {t('hero.cta')}
                        </button>
                    </div>
                </div>
            </section>

            {/* Social Proof - Reviews */}
            <section className="relative z-10 py-20 bg-gradient-to-b from-transparent via-blue-950/30 to-transparent">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('social.title')}</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {[1, 2, 3, 4].map((num) => (
                            <motion.div
                                key={num}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: num * 0.1 }}
                                className="bg-white/5 border border-white/10 rounded-2xl p-6"
                            >
                                <div className="flex gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-slate-300 mb-4 italic">"{t(`social.review${num}.text`)}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-bold">
                                        {t(`social.review${num}.author`).charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white">{t(`social.review${num}.author`)}</div>
                                        <div className="text-sm text-slate-400">{t(`social.review${num}.business`)}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="relative z-10 py-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">{t('faq.title')}</h2>

                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <motion.div
                                    key={num}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-white/5 border border-white/10 rounded-xl p-6"
                                >
                                    <h3 className="font-bold text-lg mb-2 text-white">{t(`faq.q${num}`)}</h3>
                                    <p className="text-slate-400">{t(`faq.a${num}`)}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="relative z-10 py-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/20 rounded-3xl p-12 text-center"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('cta.final.title')}</h2>
                        <p className="text-xl text-slate-300 mb-8">{t('cta.final.subtitle')}</p>

                        <div className="bg-white/10 rounded-2xl p-6 mb-8 max-w-md mx-auto">
                            <div className="flex items-baseline justify-center gap-3 mb-4">
                                <span className="text-2xl text-slate-400 line-through">{t('cta.final.originalPrice')}</span>
                                <span className="text-5xl font-bold text-white">{t('cta.final.price')}</span>
                            </div>

                            <ul className="text-left space-y-2 mb-6">
                                {t.raw('cta.final.benefits').map((benefit: string, i: number) => (
                                    <li key={i} className="text-slate-300">{benefit}</li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleCheckout()}
                                disabled={isCheckingOut}
                                className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-4 rounded-xl text-lg transition-all shadow-lg disabled:opacity-50"
                            >
                                {isCheckingOut ? 'Processing...' : t('cta.final.button')}
                            </button>

                            <p className="text-sm text-slate-400 mt-4">
                                {t('cta.final.secure')} • {t('cta.final.guarantee')}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Countdown Timer Section */}
            <section className="relative z-10 py-16 bg-gradient-to-b from-transparent via-red-950/30 to-transparent">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('urgency.title')}</h2>
                        <p className="text-slate-300 mb-8">{t('urgency.subtitle')}</p>

                        <CountdownTimer />

                        <p className="text-red-300 font-medium mt-6">
                            ⚠️ {t('urgency.warning')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Exit Intent Popup */}
            <AnimatePresence>
                {showExitPopup && (
                    <ExitIntentPopup
                        onClose={() => setShowExitPopup(false)}
                        onClaim={handleExitPopupClaim}
                    />
                )}
            </AnimatePresence>

            {/* Sticky CTA */}
            <StickyCTA
                price={basePrice}
                onCheckout={() => handleCheckout()}
                isVisible={showStickyCTA}
            />
        </div>
    )
}
