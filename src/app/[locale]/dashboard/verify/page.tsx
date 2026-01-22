'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

function VerifyContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (!token) {
            setStatus('error')
            setMessage('Token de verificação inválido')
            return
        }

        const verifyEmail = async () => {
            try {
                const response = await fetch(`/api/dashboard/verify?token=${token}`, {
                    method: 'POST',
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || 'Verificação falhou')
                }

                setStatus('success')
                setMessage(data.message || 'Email verificado com sucesso!')

                // Redirect to login after 3 seconds
                setTimeout(() => router.push('/dashboard/login'), 3000)
            } catch (err) {
                setStatus('error')
                setMessage(err instanceof Error ? err.message : 'Verificação falhou')
            }
        }

        verifyEmail()
    }, [token, router])

    if (status === 'loading') {
        return (
            <div className="text-center">
                <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">
                    Verificando...
                </h2>
                <p className="text-slate-400">
                    Aguarde enquanto verificamos seu email.
                </p>
            </div>
        )
    }

    if (status === 'success') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                    Email Verificado! ✅
                </h2>
                <p className="text-slate-400 mb-6">
                    {message}
                </p>
                <p className="text-slate-500 text-sm">
                    Redirecionando para o login...
                </p>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
        >
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
                Verificação Falhou
            </h2>
            <p className="text-slate-400 mb-6">
                {message}
            </p>
            <Link
                href="/dashboard/login"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg"
            >
                Ir para o Login
            </Link>
        </motion.div>
    )
}

export default function VerifyEmailPage() {
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
                    <Suspense fallback={
                        <div className="text-center">
                            <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
                            <p className="text-slate-400">Carregando...</p>
                        </div>
                    }>
                        <VerifyContent />
                    </Suspense>
                </div>
            </motion.div>
        </div>
    )
}
