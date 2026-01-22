'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, Loader2, CheckCircle, XCircle } from 'lucide-react'

function ResetPasswordContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('As senhas não coincidem')
            return
        }

        if (password.length < 8) {
            setError('A senha deve ter pelo menos 8 caracteres')
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('/api/dashboard/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, new_password: password }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Falha ao redefinir senha')
            }

            setIsSuccess(true)
            setTimeout(() => router.push('/dashboard/login'), 3000)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Falha ao redefinir senha')
        } finally {
            setIsLoading(false)
        }
    }

    if (!token) {
        return (
            <div className="text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-8 h-8 text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                    Link Inválido
                </h2>
                <p className="text-slate-400 mb-6">
                    Este link de redefinição de senha é inválido ou expirou.
                </p>
                <Link
                    href="/dashboard/forgot-password"
                    className="text-blue-400 hover:text-blue-300 font-medium"
                >
                    Solicitar novo link →
                </Link>
            </div>
        )
    }

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                    Senha Redefinida!
                </h2>
                <p className="text-slate-400 mb-6">
                    Sua senha foi alterada com sucesso. Redirecionando para o login...
                </p>
            </motion.div>
        )
    }

    return (
        <>
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
                Definir Nova Senha
            </h2>
            <p className="text-slate-400 text-center mb-6">
                Digite sua nova senha abaixo.
            </p>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm"
                >
                    {error}
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* New Password */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Nova Senha
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-12 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="••••••••"
                            required
                            minLength={8}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Confirmar Senha
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="••••••••"
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
                            Salvando...
                        </>
                    ) : (
                        'Salvar Nova Senha'
                    )}
                </button>
            </form>
        </>
    )
}

export default function ResetPasswordPage() {
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
                    <Suspense fallback={<div className="text-center text-slate-400">Carregando...</div>}>
                        <ResetPasswordContent />
                    </Suspense>
                </div>
            </motion.div>
        </div>
    )
}
