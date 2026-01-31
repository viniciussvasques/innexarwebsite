import { generateMetadata as genMeta } from '@/lib/seo'
import PromoPageClient from '@/components/promo/PromoPageClient'
import type { Metadata } from 'next'

type Props = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params

    const titles = {
        en: 'Professional Website $399 - Flash Sale | Innexar',
        pt: 'Site Profissional $399 - Promoção Flash | Innexar',
        es: 'Sitio Profesional $399 - Oferta Flash | Innexar'
    }

    const descriptions = {
        en: 'Get a stunning, conversion-optimized website for only $399 (save $500). 5-day delivery, free logo, 3 months free hosting. Limited spots available!',
        pt: 'Tenha um site profissional otimizado para conversão por apenas $399 (economize $500). Entrega em 5 dias, logo grátis, 3 meses de hospedagem grátis. Vagas limitadas!',
        es: 'Obtén un sitio web profesional optimizado para conversión por solo $399 (ahorra $500). Entrega en 5 días, logo gratis, 3 meses de hosting gratis. ¡Cupos limitados!'
    }

    return {
        title: titles[locale as keyof typeof titles] || titles.en,
        description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
        openGraph: {
            type: 'website',
            title: titles[locale as keyof typeof titles] || titles.en,
            description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
        },
        twitter: {
            card: 'summary_large_image',
            title: titles[locale as keyof typeof titles] || titles.en,
            description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
        }
    }
}

export default function PromoPage() {
    return <PromoPageClient />
}
