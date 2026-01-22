'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Loader2, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await fetch('/api/dashboard/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            // Always show success (security - don't reveal if email exists)
            setIsSuccess(true)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Innexar
                        </h1>
                    </Link>
                    <p className="text-slate-400 mt-2">Portal do Cliente</p>
                </div>

                {/* Card */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
                    {isSuccess ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Email Enviado!
                            </h2>
                            <p className="text-slate-400 mb-6">
                                Se existe uma conta com este email, você receberá um link para redefinir sua senha.
                            </p>
                            <Link
                                href="/dashboard/login"
                                className="text-blue-400 hover:text-blue-300 font-medium"
                            >
                                ← Voltar para o login
                            </Link>
                        </motion.div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-white mb-2 text-center">
                                Esqueceu sua senha?
                            </h2>
                            <p className="text-slate-400 text-center mb-6">
                                Digite seu email e enviaremos um link para redefinir sua senha.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="seu@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        'Enviar link de recuperação'
                                    )}
                                </button>
                            </form>

                            <p className="text-center text-slate-500 mt-6 text-sm">
                                <Link href="/dashboard/login" className="text-blue-400 hover:text-blue-300">
                                    ← Voltar para o login
                                </Link>
                            </p>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
