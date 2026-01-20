'use client'

import { useState, useEffect, Suspense, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import confetti from 'canvas-confetti'
import {
    Building2, MapPin, Briefcase, Target, Palette, Clock, Star,
    Phone, Mail, Globe, Check, ChevronRight, ChevronLeft, Rocket,
    Plus, X, Facebook, Instagram, Linkedin, Youtube, MessageCircle,
    ArrowRight, Sparkles, Users, FileText, Image, HelpCircle, DollarSign,
    Utensils, Scale, Stethoscope, Home, Wrench, Zap, TreeDeciduous, Sparkle,
    Send, Calendar, LayoutDashboard, PartyPopper
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { MetaPixel } from '@/lib/meta-pixel'

// ============ CONFIGURATION ============
const TOTAL_STEPS = 7

const steps = [
    { id: 1, title: 'Business Info', icon: Building2, description: 'Tell us about your business' },
    { id: 2, title: 'Location', icon: MapPin, description: 'Where do you operate?' },
    { id: 3, title: 'Services', icon: Briefcase, description: 'What services do you offer?' },
    { id: 4, title: 'Site Goals', icon: Target, description: 'What should your site do?' },
    { id: 5, title: 'Design', icon: Palette, description: 'Choose your visual style' },
    { id: 6, title: 'Details', icon: Clock, description: 'Business hours & social links' },
    { id: 7, title: 'Testimonials', icon: Star, description: 'Customer reviews & about' },
]

const niches = [
    { id: 'restaurant', label: 'Restaurant / Food', icon: Utensils },
    { id: 'lawyer', label: 'Lawyer / Legal', icon: Scale },
    { id: 'dentist', label: 'Dentist / Medical', icon: Stethoscope },
    { id: 'real_estate', label: 'Real Estate', icon: Home },
    { id: 'plumber', label: 'Plumber', icon: Wrench },
    { id: 'electrician', label: 'Electrician', icon: Zap },
    { id: 'landscaping', label: 'Landscaping', icon: TreeDeciduous },
    { id: 'cleaning', label: 'Cleaning', icon: Sparkle },
    { id: 'general', label: 'General Business', icon: Briefcase },
    { id: 'other', label: 'Other', icon: Building2 },
]

const pages = [
    { id: 'home', label: 'Home', required: true },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact', required: true },
    { id: 'gallery', label: 'Gallery / Portfolio' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'faq', label: 'FAQ' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'team', label: 'Our Team' },
    { id: 'blog', label: 'Blog' },
]

const objectives = [
    { id: 'generate_leads', label: 'Generate Leads', desc: 'Get more phone calls and inquiries', icon: Phone },
    { id: 'show_portfolio', label: 'Show Portfolio', desc: 'Display your work and projects', icon: Image },
    { id: 'build_trust', label: 'Build Trust', desc: 'Establish credibility online', icon: Users },
    { id: 'inform', label: 'Inform Customers', desc: 'Share information about your business', icon: FileText },
]

const tones = [
    { id: 'professional', label: 'Professional', desc: 'Corporate and trustworthy' },
    { id: 'friendly', label: 'Friendly', desc: 'Warm and approachable' },
    { id: 'premium', label: 'Premium', desc: 'Luxury and exclusive' },
]

const ctaOptions = [
    { id: 'call', label: 'Call Now', icon: Phone },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
    { id: 'form', label: 'Contact Form', icon: FileText },
    { id: 'book_online', label: 'Book Online', icon: Calendar },
]

const colorPalettes = [
    { id: 'blue', primary: '#2563eb', secondary: '#1e40af', accent: '#3b82f6', name: 'Professional Blue' },
    { id: 'green', primary: '#059669', secondary: '#047857', accent: '#10b981', name: 'Trust Green' },
    { id: 'purple', primary: '#7c3aed', secondary: '#6d28d9', accent: '#8b5cf6', name: 'Creative Purple' },
    { id: 'red', primary: '#dc2626', secondary: '#b91c1c', accent: '#ef4444', name: 'Bold Red' },
    { id: 'orange', primary: '#ea580c', secondary: '#c2410c', accent: '#f97316', name: 'Energy Orange' },
    { id: 'teal', primary: '#0d9488', secondary: '#0f766e', accent: '#14b8a6', name: 'Fresh Teal' },
    { id: 'slate', primary: '#475569', secondary: '#334155', accent: '#64748b', name: 'Modern Slate' },
    { id: 'custom', primary: '', secondary: '', accent: '', name: 'Custom Colors' },
]

const usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
]

interface Testimonial {
    name: string
    text: string
    role?: string
}

interface FormData {
    businessName: string
    businessEmail: string
    businessPhone: string
    hasWhatsapp: boolean
    businessAddress: string
    niche: string
    primaryCity: string
    state: string
    serviceAreas: string[]
    services: string[]
    primaryService: string
    siteObjective: string
    siteDescription: string
    selectedPages: string[]
    tone: string
    primaryCta: string
    ctaText: string
    colorPalette: string
    primaryColor: string
    secondaryColor: string
    accentColor: string
    referenceSites: string[]
    designNotes: string
    businessHours: Record<string, string>
    socialFacebook: string
    socialInstagram: string
    socialLinkedin: string
    socialYoutube: string
    testimonials: Testimonial[]
    googleReviewsLink: string
    aboutOwner: string
    yearsInBusiness: string
}

function OnboardingContent() {
    const t = useTranslations('launch')
    const searchParams = useSearchParams()
    const orderId = searchParams.get('order_id')

    const [currentStep, setCurrentStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    const [serviceInput, setServiceInput] = useState('')
    const [referenceInput, setReferenceInput] = useState('')
    const [serviceAreaInput, setServiceAreaInput] = useState('')

    const [formData, setFormData] = useState<FormData>({
        businessName: '',
        businessEmail: '',
        businessPhone: '',
        hasWhatsapp: false,
        businessAddress: '',
        niche: '',
        primaryCity: '',
        state: '',
        serviceAreas: [],
        services: [],
        primaryService: '',
        siteObjective: 'generate_leads',
        siteDescription: '',
        selectedPages: ['home', 'about', 'services', 'contact'],
        tone: 'professional',
        primaryCta: 'call',
        ctaText: '',
        colorPalette: 'blue',
        primaryColor: '#2563eb',
        secondaryColor: '#1e40af',
        accentColor: '#3b82f6',
        referenceSites: [],
        designNotes: '',
        businessHours: {
            mon: '9:00 AM - 5:00 PM',
            tue: '9:00 AM - 5:00 PM',
            wed: '9:00 AM - 5:00 PM',
            thu: '9:00 AM - 5:00 PM',
            fri: '9:00 AM - 5:00 PM',
            sat: 'Closed',
            sun: 'Closed',
        },
        socialFacebook: '',
        socialInstagram: '',
        socialLinkedin: '',
        socialYoutube: '',
        testimonials: [],
        googleReviewsLink: '',
        aboutOwner: '',
        yearsInBusiness: '',
    })

    const [newTestimonial, setNewTestimonial] = useState<Testimonial>({ name: '', text: '', role: '' })
    const hasTrackedLead = useRef(false)

    // Track Lead event on page load
    useEffect(() => {
        if (!hasTrackedLead.current) {
            hasTrackedLead.current = true
            MetaPixel.lead({
                content_name: 'Site Onboarding Started',
                content_category: 'Website Services',
            })
        }
    }, [])

    const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const selectColorPalette = (paletteId: string) => {
        const palette = colorPalettes.find(p => p.id === paletteId)
        if (palette && palette.id !== 'custom') {
            updateField('colorPalette', paletteId)
            updateField('primaryColor', palette.primary)
            updateField('secondaryColor', palette.secondary)
            updateField('accentColor', palette.accent)
        } else {
            updateField('colorPalette', 'custom')
        }
    }

    const addService = () => {
        if (serviceInput.trim() && formData.services.length < 15) {
            updateField('services', [...formData.services, serviceInput.trim()])
            setServiceInput('')
        }
    }

    const removeService = (index: number) => {
        const newServices = formData.services.filter((_, i) => i !== index)
        updateField('services', newServices)
        if (formData.primaryService === formData.services[index]) {
            updateField('primaryService', newServices[0] || '')
        }
    }

    const addServiceArea = () => {
        if (serviceAreaInput.trim() && formData.serviceAreas.length < 10) {
            updateField('serviceAreas', [...formData.serviceAreas, serviceAreaInput.trim()])
            setServiceAreaInput('')
        }
    }

    const addReference = () => {
        if (referenceInput.trim() && formData.referenceSites.length < 5) {
            updateField('referenceSites', [...formData.referenceSites, referenceInput.trim()])
            setReferenceInput('')
        }
    }

    const addTestimonial = () => {
        if (newTestimonial.name && newTestimonial.text && formData.testimonials.length < 10) {
            updateField('testimonials', [...formData.testimonials, { ...newTestimonial }])
            setNewTestimonial({ name: '', text: '', role: '' })
        }
    }

    const togglePage = (pageId: string) => {
        const page = pages.find(p => p.id === pageId)
        if (page?.required) return

        if (formData.selectedPages.includes(pageId)) {
            updateField('selectedPages', formData.selectedPages.filter(p => p !== pageId))
        } else {
            updateField('selectedPages', [...formData.selectedPages, pageId])
        }
    }

    const canProceed = () => {
        switch (currentStep) {
            case 1: return formData.businessName && formData.businessEmail && formData.businessPhone
            case 2: return formData.niche && formData.primaryCity && formData.state
            case 3: return formData.services.length > 0 && formData.primaryService
            case 4: return formData.siteObjective && formData.selectedPages.length >= 2
            case 5: return formData.primaryColor
            case 6: return true
            case 7: return true
            default: return false
        }
    }

    const handleSubmit = async () => {
        if (!canProceed()) return
        setIsSubmitting(true)

        try {
            const payload = {
                business_name: formData.businessName,
                business_email: formData.businessEmail,
                business_phone: formData.businessPhone,
                has_whatsapp: formData.hasWhatsapp,
                business_address: formData.businessAddress,
                niche: formData.niche,
                primary_city: formData.primaryCity,
                state: formData.state,
                service_areas: formData.serviceAreas,
                services: formData.services,
                primary_service: formData.primaryService,
                site_objective: formData.siteObjective,
                site_description: formData.siteDescription,
                selected_pages: formData.selectedPages,
                total_pages: formData.selectedPages.length,
                tone: formData.tone,
                primary_cta: formData.primaryCta,
                cta_text: formData.ctaText,
                primary_color: formData.primaryColor,
                secondary_color: formData.secondaryColor,
                accent_color: formData.accentColor,
                reference_sites: formData.referenceSites,
                design_notes: formData.designNotes,
                business_hours: formData.businessHours,
                social_facebook: formData.socialFacebook,
                social_instagram: formData.socialInstagram,
                social_linkedin: formData.socialLinkedin,
                social_youtube: formData.socialYoutube,
                testimonials: formData.testimonials,
                google_reviews_link: formData.googleReviewsLink,
                about_owner: formData.aboutOwner,
                years_in_business: formData.yearsInBusiness ? parseInt(formData.yearsInBusiness) : null,
                is_complete: true,
                completed_steps: TOTAL_STEPS,
            }

            const response = await fetch(`/api/launch/onboarding?order_id=${orderId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (response.ok) {
                // Track CompleteRegistration
                MetaPixel.completeRegistration({
                    content_name: 'Site Onboarding Complete',
                    status: 'success',
                })
                setIsComplete(true)
            } else {
                throw new Error('Failed to submit')
            }
        } catch (error) {
            console.error('Error submitting onboarding:', error)
            alert('Something went wrong. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Fire confetti celebration
    const fireConfetti = useCallback(() => {
        const duration = 3000
        const animationEnd = Date.now() + duration
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now()
            if (timeLeft <= 0) {
                return clearInterval(interval)
            }
            const particleCount = 50 * (timeLeft / duration)
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            })
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            })
        }, 250)
    }, [])

    // Trigger confetti when complete
    useEffect(() => {
        if (isComplete) {
            fireConfetti()
        }
    }, [isComplete, fireConfetti])

    // ============ COMPLETION SCREEN ============
    if (isComplete) {
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

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-lg text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 relative z-10"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.2 }}
                        className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30"
                    >
                        <motion.div
                            initial={{ rotate: -180, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <PartyPopper className="w-12 h-12 text-white" />
                        </motion.div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-bold text-white mb-2"
                    >
                        Congratulations!
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg text-green-400 font-medium mb-4"
                    >
                        {formData.businessName ? `${formData.businessName}'s website is on the way!` : "You're All Set!"}
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-slate-300 mb-8"
                    >
                        Our team has received your information and is now crafting your perfect website.
                        You'll receive your site preview within 5 business days.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-5 text-left mb-6"
                    >
                        <p className="font-semibold text-blue-300 mb-3 flex items-center gap-2">
                            <Rocket className="w-5 h-5" />
                            What happens next?
                        </p>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-3 text-slate-300">
                                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                                <span>Confirmation email with order details</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300">
                                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                                <span>Our design team reviews your requirements</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300">
                                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                                <span>First draft delivered in 3-5 business days</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300">
                                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                                <span>2 rounds of revisions included</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="space-y-3"
                    >
                        <a
                            href={`/launch/dashboard?order_id=${orderId}&email=${encodeURIComponent(formData.businessEmail)}`}
                            className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl font-bold text-white shadow-lg shadow-blue-500/25 transition-all"
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            Track Your Project
                        </a>
                        <a
                            href="/"
                            className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl font-medium text-slate-300 transition-all"
                        >
                            Return to Home
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-8 pt-6 border-t border-white/10"
                    >
                        <div className="flex items-center justify-center gap-2 text-slate-500 text-xs">
                            <Sparkles className="w-4 h-4" />
                            Trusted by 200+ local businesses
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        )
    }

    // ============ MAIN FORM ============
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-8 px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
                {/* Progress Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4 overflow-x-auto pb-2">
                        {steps.map((step, index) => {
                            const StepIcon = step.icon
                            return (
                                <div key={step.id} className="flex items-center">
                                    <motion.button
                                        onClick={() => currentStep > step.id && setCurrentStep(step.id)}
                                        disabled={currentStep < step.id}
                                        animate={{ scale: currentStep === step.id ? 1.1 : 1 }}
                                        className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-colors ${currentStep > step.id
                                            ? 'bg-green-500 cursor-pointer'
                                            : currentStep === step.id
                                                ? 'bg-blue-500'
                                                : 'bg-white/10'
                                            }`}
                                    >
                                        {currentStep > step.id ? (
                                            <Check className="w-5 h-5" />
                                        ) : (
                                            <StepIcon className="w-5 h-5" />
                                        )}
                                    </motion.button>
                                    {index < steps.length - 1 && (
                                        <div className={`w-8 md:w-12 h-1 mx-1 rounded-full ${currentStep > step.id ? 'bg-green-500' : 'bg-white/10'
                                            }`} />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                    <div className="text-center">
                        <span className="text-blue-400 font-semibold">Step {currentStep} of {TOTAL_STEPS}:</span>{' '}
                        <span className="text-white">{steps[currentStep - 1].title}</span>
                        <p className="text-slate-400 text-sm mt-1">{steps[currentStep - 1].description}</p>
                    </div>
                </div>

                {/* Form Card */}
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8"
                >
                    {/* ============ STEP 1: Business Info ============ */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Business Name *</label>
                                <input
                                    type="text"
                                    value={formData.businessName}
                                    onChange={e => updateField('businessName', e.target.value)}
                                    placeholder="e.g., Joe's Plumbing"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Business Email *</label>
                                    <input
                                        type="email"
                                        value={formData.businessEmail}
                                        onChange={e => updateField('businessEmail', e.target.value)}
                                        placeholder="contact@business.com"
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number *</label>
                                    <input
                                        type="tel"
                                        value={formData.businessPhone}
                                        onChange={e => updateField('businessPhone', e.target.value)}
                                        placeholder="(555) 123-4567"
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.hasWhatsapp}
                                    onChange={e => updateField('hasWhatsapp', e.target.checked)}
                                    className="w-5 h-5 rounded border-white/20 bg-white/10"
                                />
                                <span className="text-slate-300">This number has WhatsApp</span>
                            </label>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Business Address (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.businessAddress}
                                    onChange={e => updateField('businessAddress', e.target.value)}
                                    placeholder="123 Main St, City, State"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* ============ STEP 2: Location & Niche ============ */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-3">Business Type *</label>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                    {niches.map(niche => {
                                        const NicheIcon = niche.icon
                                        return (
                                            <motion.button
                                                key={niche.id}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => updateField('niche', niche.id)}
                                                className={`p-3 rounded-xl border text-center transition-colors ${formData.niche === niche.id
                                                    ? 'bg-blue-500/20 border-blue-400'
                                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                                                    }`}
                                            >
                                                <NicheIcon className="w-6 h-6 mx-auto mb-1" />
                                                <div className="text-xs">{niche.label}</div>
                                            </motion.button>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Primary City *</label>
                                    <input
                                        type="text"
                                        value={formData.primaryCity}
                                        onChange={e => updateField('primaryCity', e.target.value)}
                                        placeholder="e.g., Orlando"
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">State *</label>
                                    <select
                                        value={formData.state}
                                        onChange={e => updateField('state', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="" className="bg-slate-800">Select state</option>
                                        {usStates.map(state => (
                                            <option key={state} value={state} className="bg-slate-800">{state}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Other Service Areas (Optional)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={serviceAreaInput}
                                        onChange={e => setServiceAreaInput(e.target.value)}
                                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addServiceArea())}
                                        placeholder="Add nearby cities..."
                                        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                    />
                                    <button onClick={addServiceArea} className="px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors">
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                {formData.serviceAreas.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {formData.serviceAreas.map((area, i) => (
                                            <span key={i} className="px-3 py-1 bg-white/10 rounded-lg flex items-center gap-2">
                                                {area}
                                                <button onClick={() => updateField('serviceAreas', formData.serviceAreas.filter((_, j) => j !== i))} className="text-slate-400 hover:text-red-400">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ============ STEP 3: Services ============ */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Add Your Services (up to 15) *</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={serviceInput}
                                        onChange={e => setServiceInput(e.target.value)}
                                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addService())}
                                        placeholder="e.g., Emergency Repairs"
                                        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                    />
                                    <button onClick={addService} className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium transition-colors flex items-center gap-2">
                                        <Plus className="w-5 h-5" /> Add
                                    </button>
                                </div>
                            </div>
                            {formData.services.length > 0 && (
                                <div>
                                    <p className="text-sm text-slate-400 mb-2">Click to select your PRIMARY service:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.services.map((service, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${formData.primaryService === service
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                                                    }`}
                                                onClick={() => updateField('primaryService', service)}
                                            >
                                                {formData.primaryService === service && <Star className="w-4 h-4" />}
                                                <span>{service}</span>
                                                <button
                                                    onClick={e => { e.stopPropagation(); removeService(index) }}
                                                    className="ml-1 text-slate-400 hover:text-red-400"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ============ STEP 4: Site Goals & Pages ============ */}
                    {currentStep === 4 && (
                        <div className="space-y-8">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-3">What's the main goal of your website? *</label>
                                <div className="grid md:grid-cols-2 gap-3">
                                    {objectives.map(obj => {
                                        const ObjIcon = obj.icon
                                        return (
                                            <motion.button
                                                key={obj.id}
                                                whileHover={{ scale: 1.02 }}
                                                onClick={() => updateField('siteObjective', obj.id)}
                                                className={`p-4 rounded-xl border text-left transition-colors ${formData.siteObjective === obj.id
                                                    ? 'bg-blue-500/20 border-blue-400'
                                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <ObjIcon className="w-6 h-6" />
                                                    <div>
                                                        <div className="font-medium">{obj.label}</div>
                                                        <div className="text-xs text-slate-400">{obj.desc}</div>
                                                    </div>
                                                </div>
                                            </motion.button>
                                        )
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-3">Select pages for your site (5 included):</label>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                    {pages.map(page => (
                                        <motion.button
                                            key={page.id}
                                            whileHover={{ scale: page.required ? 1 : 1.02 }}
                                            onClick={() => togglePage(page.id)}
                                            className={`p-3 rounded-xl border text-sm transition-colors flex items-center justify-center gap-1 ${formData.selectedPages.includes(page.id)
                                                ? 'bg-blue-500/20 border-blue-400'
                                                : 'bg-white/5 border-white/10 hover:border-white/20'
                                                } ${page.required ? 'opacity-70 cursor-default' : ''}`}
                                        >
                                            {page.label}
                                            {page.required && <Check className="w-3 h-3 text-blue-300" />}
                                        </motion.button>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-400 mt-2">Selected: {formData.selectedPages.length} pages</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Brief Description (Optional)</label>
                                <textarea
                                    value={formData.siteDescription}
                                    onChange={e => updateField('siteDescription', e.target.value)}
                                    placeholder="Tell us about your business, what makes you different..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-3">Website Tone</label>
                                    <div className="space-y-2">
                                        {tones.map(tone => (
                                            <button
                                                key={tone.id}
                                                onClick={() => updateField('tone', tone.id)}
                                                className={`w-full p-3 rounded-xl border text-left transition-colors ${formData.tone === tone.id
                                                    ? 'bg-blue-500/20 border-blue-400'
                                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                                                    }`}
                                            >
                                                <div className="font-medium">{tone.label}</div>
                                                <div className="text-xs text-slate-400">{tone.desc}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-3">Main Call to Action</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {ctaOptions.map(cta => {
                                            const CtaIcon = cta.icon
                                            return (
                                                <button
                                                    key={cta.id}
                                                    onClick={() => updateField('primaryCta', cta.id)}
                                                    className={`p-3 rounded-xl border text-center transition-colors ${formData.primaryCta === cta.id
                                                        ? 'bg-blue-500/20 border-blue-400'
                                                        : 'bg-white/5 border-white/10 hover:border-white/20'
                                                        }`}
                                                >
                                                    <CtaIcon className="w-5 h-5 mx-auto mb-1" />
                                                    <div className="text-sm">{cta.label}</div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.ctaText}
                                        onChange={e => updateField('ctaText', e.target.value)}
                                        placeholder="Custom CTA text (e.g., Get Free Quote)"
                                        className="w-full mt-3 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ============ STEP 5: Design & Colors ============ */}
                    {currentStep === 5 && (
                        <div className="space-y-8">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-3">Choose a Color Palette</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {colorPalettes.filter(p => p.id !== 'custom').map(palette => (
                                        <motion.button
                                            key={palette.id}
                                            whileHover={{ scale: 1.02 }}
                                            onClick={() => selectColorPalette(palette.id)}
                                            className={`p-4 rounded-xl border transition-all ${formData.colorPalette === palette.id
                                                ? 'border-white ring-2 ring-white/50'
                                                : 'border-white/10 hover:border-white/30'
                                                }`}
                                        >
                                            <div className="flex gap-1 mb-2">
                                                <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: palette.primary }} />
                                                <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: palette.secondary }} />
                                                <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: palette.accent }} />
                                            </div>
                                            <div className="text-xs">{palette.name}</div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-3">Or Choose Custom Colors</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {['primary', 'secondary', 'accent'].map(colorType => (
                                        <div key={colorType}>
                                            <label className="text-xs text-slate-400 capitalize">{colorType}</label>
                                            <div className="flex gap-2 items-center mt-1">
                                                <input
                                                    type="color"
                                                    value={formData[`${colorType}Color` as keyof FormData] as string}
                                                    onChange={e => {
                                                        updateField(`${colorType}Color` as keyof FormData, e.target.value as never)
                                                        updateField('colorPalette', 'custom')
                                                    }}
                                                    className="w-12 h-12 rounded-lg cursor-pointer border-0"
                                                />
                                                <input
                                                    type="text"
                                                    value={formData[`${colorType}Color` as keyof FormData] as string}
                                                    onChange={e => {
                                                        updateField(`${colorType}Color` as keyof FormData, e.target.value as never)
                                                        updateField('colorPalette', 'custom')
                                                    }}
                                                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm font-mono"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Reference Sites (Optional)</label>
                                <p className="text-xs text-slate-400 mb-2">Add URLs of websites you like for design inspiration</p>
                                <div className="flex gap-2">
                                    <input
                                        type="url"
                                        value={referenceInput}
                                        onChange={e => setReferenceInput(e.target.value)}
                                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addReference())}
                                        placeholder="https://example.com"
                                        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                    />
                                    <button onClick={addReference} className="px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors">
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                {formData.referenceSites.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {formData.referenceSites.map((site, i) => (
                                            <span key={i} className="px-3 py-1 bg-white/10 rounded-lg flex items-center gap-2 text-sm">
                                                <Globe className="w-3 h-3" />
                                                {site.length > 25 ? site.substring(0, 25) + '...' : site}
                                                <button onClick={() => updateField('referenceSites', formData.referenceSites.filter((_, j) => j !== i))} className="text-slate-400 hover:text-red-400">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Additional Design Notes (Optional)</label>
                                <textarea
                                    value={formData.designNotes}
                                    onChange={e => updateField('designNotes', e.target.value)}
                                    placeholder="Any specific design preferences, elements you want, or things to avoid..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* ============ STEP 6: Business Details ============ */}
                    {currentStep === 6 && (
                        <div className="space-y-8">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-3">Business Hours (Optional)</label>
                                <div className="grid gap-2">
                                    {[
                                        { key: 'mon', label: 'Monday' },
                                        { key: 'tue', label: 'Tuesday' },
                                        { key: 'wed', label: 'Wednesday' },
                                        { key: 'thu', label: 'Thursday' },
                                        { key: 'fri', label: 'Friday' },
                                        { key: 'sat', label: 'Saturday' },
                                        { key: 'sun', label: 'Sunday' },
                                    ].map(day => (
                                        <div key={day.key} className="flex items-center gap-3">
                                            <span className="w-24 text-sm text-slate-400">{day.label}</span>
                                            <input
                                                type="text"
                                                value={formData.businessHours[day.key] || ''}
                                                onChange={e => updateField('businessHours', { ...formData.businessHours, [day.key]: e.target.value })}
                                                placeholder="e.g., 9am - 5pm or Closed"
                                                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-3">Social Media Links (Optional)</label>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-slate-400 flex items-center gap-2 mb-1"><Facebook className="w-4 h-4" /> Facebook</label>
                                        <input
                                            type="url"
                                            value={formData.socialFacebook}
                                            onChange={e => updateField('socialFacebook', e.target.value)}
                                            placeholder="https://facebook.com/yourpage"
                                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-400 flex items-center gap-2 mb-1"><Instagram className="w-4 h-4" /> Instagram</label>
                                        <input
                                            type="url"
                                            value={formData.socialInstagram}
                                            onChange={e => updateField('socialInstagram', e.target.value)}
                                            placeholder="https://instagram.com/yourhandle"
                                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-400 flex items-center gap-2 mb-1"><Linkedin className="w-4 h-4" /> LinkedIn</label>
                                        <input
                                            type="url"
                                            value={formData.socialLinkedin}
                                            onChange={e => updateField('socialLinkedin', e.target.value)}
                                            placeholder="https://linkedin.com/in/yourprofile"
                                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-400 flex items-center gap-2 mb-1"><Youtube className="w-4 h-4" /> YouTube</label>
                                        <input
                                            type="url"
                                            value={formData.socialYoutube}
                                            onChange={e => updateField('socialYoutube', e.target.value)}
                                            placeholder="https://youtube.com/@yourchannel"
                                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ============ STEP 7: Testimonials & About ============ */}
                    {currentStep === 7 && (
                        <div className="space-y-8">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-3">Customer Testimonials (Optional)</label>
                                <p className="text-xs text-slate-400 mb-3">Add reviews from happy customers to display on your site</p>

                                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                                    <input
                                        type="text"
                                        value={newTestimonial.name}
                                        onChange={e => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                                        placeholder="Customer name"
                                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                                    />
                                    <input
                                        type="text"
                                        value={newTestimonial.role || ''}
                                        onChange={e => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                                        placeholder="Role (e.g., Homeowner, Business Owner)"
                                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                                    />
                                    <textarea
                                        value={newTestimonial.text}
                                        onChange={e => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
                                        placeholder="Their review or testimonial..."
                                        rows={2}
                                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                                    />
                                    <button
                                        onClick={addTestimonial}
                                        className="w-full py-2 bg-blue-500/20 border border-blue-400/30 rounded-lg text-blue-300 hover:bg-blue-500/30 flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" /> Add Testimonial
                                    </button>
                                </div>

                                {formData.testimonials.length > 0 && (
                                    <div className="mt-4 space-y-3">
                                        {formData.testimonials.map((t, i) => (
                                            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 relative">
                                                <button
                                                    onClick={() => updateField('testimonials', formData.testimonials.filter((_, j) => j !== i))}
                                                    className="absolute top-2 right-2 text-slate-400 hover:text-red-400"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                                <div className="font-medium">{t.name}</div>
                                                {t.role && <div className="text-xs text-slate-400">{t.role}</div>}
                                                <div className="text-sm text-slate-300 mt-2">"{t.text}"</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Google Reviews Link (Optional)</label>
                                <input
                                    type="url"
                                    value={formData.googleReviewsLink}
                                    onChange={e => updateField('googleReviewsLink', e.target.value)}
                                    placeholder="https://g.page/yourbusiness/review"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">About You / Your Business (Optional)</label>
                                <textarea
                                    value={formData.aboutOwner}
                                    onChange={e => updateField('aboutOwner', e.target.value)}
                                    placeholder="Share your story, experience, and what makes your business special..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Years in Business (Optional)</label>
                                <input
                                    type="number"
                                    value={formData.yearsInBusiness}
                                    onChange={e => updateField('yearsInBusiness', e.target.value)}
                                    placeholder="e.g., 10"
                                    className="w-32 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* ============ Navigation ============ */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                        <motion.button
                            whileHover={{ scale: currentStep > 1 ? 1.02 : 1 }}
                            whileTap={{ scale: currentStep > 1 ? 0.98 : 1 }}
                            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                            disabled={currentStep === 1}
                            className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20'
                                }`}
                        >
                            <ChevronLeft className="w-5 h-5" /> Back
                        </motion.button>

                        {currentStep < TOTAL_STEPS ? (
                            <motion.button
                                whileHover={{ scale: canProceed() ? 1.02 : 1 }}
                                whileTap={{ scale: canProceed() ? 0.98 : 1 }}
                                onClick={() => canProceed() && setCurrentStep(prev => prev + 1)}
                                className={`px-8 py-3 rounded-xl font-medium flex items-center gap-2 ${canProceed() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-slate-700 cursor-not-allowed'
                                    }`}
                            >
                                Continue <ChevronRight className="w-5 h-5" />
                            </motion.button>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`px-8 py-3 rounded-xl font-medium flex items-center gap-2 ${isSubmitting
                                    ? 'bg-slate-700 cursor-wait'
                                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Rocket className="w-5 h-5" />
                                        Complete Onboarding
                                    </>
                                )}
                            </motion.button>
                        )}
                    </div>
                </motion.div>

                {/* Progress indicator */}
                <div className="mt-6 text-center text-slate-400 text-sm">
                    Progress: {Math.round((currentStep / TOTAL_STEPS) * 100)}% complete
                </div>
            </div>
        </div>
    )
}

export default function OnboardingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <OnboardingContent />
        </Suspense>
    )
}
