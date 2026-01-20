import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import { generateMetadata as genMeta } from '@/lib/seo'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import StructuredData from '@/components/StructuredData'
import AIChat from '@/components/ai-chat/AIChat'
import MetaPixelProvider from '@/components/providers/MetaPixelProvider'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

const locales = ['en', 'pt', 'es']

type Props = {
  readonly children: React.ReactNode
  readonly params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return genMeta(locale, 'home')
}

export default async function RootLayout({
  children,
  params
}: Props) {
  const { locale } = await params

  // Validate locale
  if (!locales.includes(locale)) {
    notFound()
  }

  const messages = await getMessages({ locale })
  const { generateStructuredData } = await import('@/lib/seo')
  const structuredData = generateStructuredData(locale, 'home')

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <StructuredData
          organization={structuredData.organization}
          website={structuredData.website}
        />
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <MetaPixelProvider pixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID}>
          <NextIntlClientProvider messages={messages} locale={locale}>
            {children}
            <AIChat />
          </NextIntlClientProvider>
        </MetaPixelProvider>
      </body>
    </html>
  )
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'pt' }, { locale: 'es' }]
}
