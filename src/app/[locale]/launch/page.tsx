'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Check, Sparkles, Rocket, Clock, Shield, Plus, Minus,
    Star, Quote, ChevronRight, Zap, Palette, Search, MessageCircle,
    Users, Award, Globe, ArrowRight, Phone, Play
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { MetaPixel } from '@/lib/meta-pixel'

// Add-ons data
const addons = [
    { id: 'logo', name: 'Logo Design', price: 99, description: 'Professional logo with 3 concepts', icon: Palette },
    { id: 'seo', name: 'SEO Local Pro', price: 149, description: 'Advanced local SEO optimization', icon: Search },
    { id: 'extra-page', name: 'Extra Page', price: 79, description: 'Additional custom page', icon: Plus },
    { id: 'whatsapp', name: 'WhatsApp Widget', price: 49, description: 'Direct WhatsApp integration', icon: MessageCircle },
    { id: 'google-business', name: 'Google Business Setup', price: 49, description: 'Complete GMB optimization', icon: Globe },
]

// Animated counter
function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        let start = 0
        const increment = target / (duration / 16)
        const timer = setInterval(() => {
            start += increment
            if (start >= target) {
                setCount(target)
                clearInterval(timer)
            } else {
                setCount(Math.floor(start))
            }
        }, 16)
        return () => clearInterval(timer)
    }, [target, duration])

    return <span>{count}</span>
}

// Typing effect
function TypingText({ text, speed = 50 }: { text: string; speed?: number }) {
    const [displayText, setDisplayText] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        if (currentIndex < text.length) {
            const timer = setTimeout(() => {
                setDisplayText(prev => prev + text[currentIndex])
                setCurrentIndex(prev => prev + 1)
            }, speed)
            return () => clearTimeout(timer)
        }
    }, [currentIndex, text, speed])

    return (
        <span>
            {displayText}
            <span className="animate-pulse">|</span>
        </span>
    )
}

export default function LaunchPage() {
    const t = useTranslations('launch')
    const [selectedAddons, setSelectedAddons] = useState<string[]>([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [isCheckingOut, setIsCheckingOut] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
        // Track page view content
        MetaPixel.viewContent({
            content_name: 'Website Launch Landing Page',
            content_category: 'Website Services',
            content_type: 'product',
            value: 399,
            currency: 'USD',
        })
    }, [])

    const basePrice = 399
    const addonsTotal = selectedAddons.reduce((sum, id) => {
        const addon = addons.find(a => a.id === id)
        return sum + (addon?.price || 0)
    }, 0)
    const totalPrice = basePrice + addonsTotal

    const toggleAddon = (id: string) => {
        const addon = addons.find(a => a.id === id)
        if (addon) {
            if (!selectedAddons.includes(id)) {
                // Track addon selection
                MetaPixel.selectAddon(addon.name, addon.price)
            }
        }
        setSelectedAddons(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        )
    }

    const handleCheckout = async () => {
        setIsCheckingOut(true)

        // Track InitiateCheckout
        MetaPixel.initiateCheckout({
            value: totalPrice,
            currency: 'USD',
            content_ids: ['professional-website', ...selectedAddons],
            content_type: 'product',
            num_items: 1 + selectedAddons.length,
        })

        try {
            const response = await fetch('/api/launch/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    addons: selectedAddons,
                }),
            })
            const data = await response.json()
            if (data.url) {
                window.location.href = data.url
            }
        } catch (error) {
            console.error('Checkout error:', error)
            setIsCheckingOut(false)
        }
    }

    const features = [
        { icon: Zap, title: t('features.fast'), desc: t('features.fastDesc') },
        { icon: Palette, title: t('features.responsive'), desc: t('features.responsiveDesc') },
        { icon: Search, title: t('features.seo'), desc: t('features.seoDesc') },
        { icon: Phone, title: t('features.support'), desc: t('features.supportDesc') },
        { icon: Shield, title: t('hero.guarantee'), desc: t('features.supportDesc') },
        { icon: Award, title: t('features.title'), desc: t('features.responsiveDesc') },
    ]

    const testimonials = [
        {
            name: 'Michael Rodriguez',
            business: 'Rodriguez Plumbing LLC',
            location: 'Orlando, FL',
            text: 'The site looks amazing and I started getting calls within the first week. Best investment I made for my business this year. The team was professional and delivered exactly what they promised.',
            rating: 5,
        },
        {
            name: 'Sarah Johnson',
            business: 'Johnson Law Firm',
            location: 'Dallas, TX',
            text: 'Professional, fast, and they actually listened to what I wanted. My clients love the new website. It establishes our credibility immediately.',
            rating: 5,
        },
        {
            name: 'David Chen',
            business: 'Chen Dental Care',
            location: 'Seattle, WA',
            text: 'The onboarding process was so easy. I just answered a few questions and they built exactly what I envisioned. Exceeded my expectations.',
            rating: 5,
        },
        {
            name: 'Maria Garcia',
            business: 'Garcia Landscaping',
            location: 'Phoenix, AZ',
            text: 'Had my website up in 4 days. The design is modern and my customers always compliment it. Getting way more leads now.',
            rating: 5,
        },
        {
            name: 'James Wilson',
            business: 'Wilson Electric',
            location: 'Denver, CO',
            text: 'Finally a website that actually works on mobile! The quality is incredible for the price. Highly recommend.',
            rating: 5,
        },
        {
            name: 'Lisa Thompson',
            business: "Lisa's Cleaning Service",
            location: 'Miami, FL',
            text: 'The team was responsive and made changes quickly. My site looks like I paid ten times what I actually paid. Worth every penny.',
            rating: 5,
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-blue-500/10 to-transparent rounded-full" />
            </div>

            {/* Hero Section */}
            <section className="relative z-10 min-h-screen flex items-center justify-center py-20">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/10 rounded-full text-sm mb-8 backdrop-blur-sm"
                        >
                            <Sparkles className="w-4 h-4 text-blue-400" />
                            <span className="text-slate-300">Trusted by <strong className="text-white">200+</strong> local businesses</span>
                        </motion.div>

                        {/* Main Headline */}
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                                {t('hero.title')}
                            </span>
                            <br />
                            <span className="text-blue-400">
                                {isLoaded && <TypingText text={t('hero.highlight')} speed={80} />}
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto"
                        >
                            {t('hero.subtitle')}
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <motion.a
                                href="#pricing"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                className="group px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg shadow-2xl shadow-white/10 hover:shadow-white/20 transition-all flex items-center gap-2"
                            >
                                {t('hero.cta')}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.a>
                            <motion.a
                                href="#examples"
                                whileHover={{ scale: 1.02 }}
                                className="px-8 py-4 bg-white/10 border border-white/20 rounded-xl font-medium text-lg hover:bg-white/20 transition-all flex items-center gap-2"
                            >
                                <Play className="w-5 h-5" />
                                {t('process.step4')}
                            </motion.a>
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="flex flex-wrap justify-center gap-8 mt-16"
                        >
                            {[
                                { value: '200+', label: 'Sites Delivered' },
                                { value: '4.9', label: 'Star Rating' },
                                { value: '5 Days', label: 'Avg. Delivery' },
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                                    <div className="text-sm text-slate-400">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                >
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                        <div className="w-2 h-3 bg-white/50 rounded-full mt-2 animate-bounce" />
                    </div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="relative z-10 py-20 border-y border-white/10 bg-white/5">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: 200, suffix: '+', label: 'Websites Built', icon: Globe },
                            { value: 98, suffix: '%', label: 'Client Satisfaction', icon: Award },
                            { value: 5, suffix: ' Days', label: 'Average Delivery', icon: Clock },
                            { value: 24, suffix: '/7', label: 'Support Available', icon: MessageCircle },
                        ].map((stat, i) => {
                            const StatIcon = stat.icon
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                                        <StatIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-4xl font-bold mb-1">
                                        <AnimatedCounter target={stat.value} />
                                        {stat.suffix}
                                    </div>
                                    <div className="text-slate-400">{stat.label}</div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative z-10 py-24">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block px-4 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-sm mb-4">
                            {t('features.title')}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('features.title')}</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">{t('hero.subtitle')}</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => {
                            const FeatureIcon = feature.icon
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                    className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-blue-400/50 hover:bg-white/[0.08] transition-all"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <FeatureIcon className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                    <p className="text-slate-400">{feature.desc}</p>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="relative z-10 py-24 bg-gradient-to-b from-transparent via-blue-950/50 to-transparent">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1 bg-yellow-500/20 border border-yellow-400/30 rounded-full text-yellow-300 text-sm mb-4">
                            <Star className="w-4 h-4 fill-yellow-400" />
                            Customer Reviews
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">What Our Clients Say</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">Don't just take our word for it. Here's what business owners like you are saying about our work.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {testimonials.map((review, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all relative"
                            >
                                <Quote className="absolute top-4 right-4 w-8 h-8 text-white/10" />
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(review.rating)].map((_, j) => (
                                        <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-slate-300 mb-6 leading-relaxed">"{review.text}"</p>
                                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-sm">
                                        {review.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white text-sm">{review.name}</div>
                                        <div className="text-xs text-slate-400">{review.business}</div>
                                        <div className="text-xs text-slate-500">{review.location}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Trust Badges */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-wrap justify-center gap-8 mt-16 pt-8 border-t border-white/10"
                    >
                        {[
                            { icon: Check, text: '200+ Sites Delivered' },
                            { icon: Star, text: '4.9/5 Average Rating' },
                            { icon: Clock, text: '5-Day Delivery' },
                            { icon: Shield, text: '100% Satisfaction' },
                        ].map((badge, i) => {
                            const BadgeIcon = badge.icon
                            return (
                                <div key={i} className="flex items-center gap-2 text-slate-400">
                                    <BadgeIcon className="w-5 h-5 text-green-400" />
                                    <span>{badge.text}</span>
                                </div>
                            )
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="relative z-10 py-24">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block px-4 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-green-300 text-sm mb-4">
                            {t('cta.total')}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('features.title')}</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">{t('hero.guarantee')}</p>
                    </motion.div>

                    <div className="max-w-4xl mx-auto">
                        {/* Main Price Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 md:p-12 relative overflow-hidden"
                        >
                            {/* Popular Badge */}
                            <div className="absolute top-6 right-6">
                                <span className="px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-full">
                                    Most Popular
                                </span>
                            </div>

                            <div className="grid md:grid-cols-2 gap-12">
                                {/* Left - Price & Features */}
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Professional Website</h3>
                                    <div className="flex items-baseline gap-2 mb-6">
                                        <span className="text-5xl font-bold">${basePrice}</span>
                                        <span className="text-slate-400">one-time</span>
                                    </div>

                                    <ul className="space-y-3 mb-8">
                                        {[
                                            '5 Custom Pages',
                                            'Mobile-Responsive Design',
                                            'SEO Optimization',
                                            'Contact Form Integration',
                                            '5-Day Delivery',
                                            '2 Revision Rounds',
                                            'Source Code Ownership',
                                            '30-Day Support',
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-slate-300">
                                                <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <Check className="w-3 h-3 text-green-400" />
                                                </div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Right - Add-ons */}
                                <div>
                                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <Plus className="w-5 h-5 text-blue-400" />
                                        {t('addons.title')}
                                    </h4>
                                    <div className="space-y-3">
                                        {addons.map((addon) => {
                                            const isSelected = selectedAddons.includes(addon.id)
                                            const AddonIcon = addon.icon
                                            return (
                                                <motion.button
                                                    key={addon.id}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => toggleAddon(addon.id)}
                                                    className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${isSelected
                                                        ? 'bg-blue-500/20 border-blue-400'
                                                        : 'bg-white/5 border-white/10 hover:border-white/20'
                                                        }`}
                                                >
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-blue-500' : 'bg-white/10'
                                                        }`}>
                                                        <AddonIcon className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-medium text-sm">{addon.name}</div>
                                                        <div className="text-xs text-slate-400">{addon.description}</div>
                                                    </div>
                                                    <div className="font-bold text-sm">+${addon.price}</div>
                                                </motion.button>
                                            )
                                        })}
                                    </div>

                                    {/* Total */}
                                    <div className="mt-6 pt-6 border-t border-white/10">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-slate-400">{t('cta.total')}</span>
                                            <span className="text-3xl font-bold">${totalPrice}</span>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleCheckout}
                                            disabled={isCheckingOut}
                                            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${isCheckingOut
                                                ? 'bg-slate-600 cursor-wait'
                                                : 'bg-white text-slate-900 hover:bg-slate-100 shadow-lg shadow-white/10'
                                                }`}
                                        >
                                            {isCheckingOut ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <Rocket className="w-5 h-5" />
                                                    {t('cta.checkout')}
                                                </>
                                            )}
                                        </motion.button>
                                        <p className="text-center text-xs text-slate-400 mt-3">
                                            {t('cta.secure')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Guarantee */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-8 text-center"
                        >
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-500/10 border border-green-400/30 rounded-xl">
                                <Shield className="w-5 h-5 text-green-400" />
                                <span className="text-green-300 font-medium">{t('hero.guarantee')}</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="relative z-10 py-24 bg-gradient-to-b from-transparent to-slate-900/50">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('faq.title')}</h2>
                    </motion.div>

                    <div className="max-w-3xl mx-auto space-y-4">
                        {[
                            { q: t('faq.q1'), a: t('faq.a1') },
                            { q: t('faq.q2'), a: t('faq.a2') },
                            { q: t('faq.q3'), a: t('faq.a3') },
                            { q: t('faq.q4'), a: t('faq.a4') },
                            { q: t('faq.q5'), a: t('faq.a5') },
                        ].map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors"
                            >
                                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                                <p className="text-slate-400">{faq.a}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="relative z-10 py-24">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 rounded-3xl p-12 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10" />
                        <div className="relative">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('hero.title')}</h2>
                            <p className="text-xl text-slate-300 mb-8">
                                {t('hero.subtitle')}
                            </p>
                            <motion.a
                                href="#pricing"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center gap-3 bg-white text-slate-900 px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-white/10 hover:shadow-white/20 transition-all"
                            >
                                <Rocket className="w-5 h-5" />
                                {t('hero.cta')}
                            </motion.a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-12 border-t border-white/10">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-lg">Innexar</span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-slate-400">
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Contact</a>
                        </div>
                        <p className="text-sm text-slate-500">© 2026 Innexar. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
