'use client'

import { useEffect } from 'react'

interface StructuredDataProps {
    organization: object
    website: object
}

export default function StructuredData({ organization, website }: StructuredDataProps) {
    useEffect(() => {
        // Remove scripts antigos se existirem
        const existingOrg = document.getElementById('structured-data-organization')
        const existingWeb = document.getElementById('structured-data-website')

        if (existingOrg) existingOrg.remove()
        if (existingWeb) existingWeb.remove()

        // Cria e adiciona script de organização
        const orgScript = document.createElement('script')
        orgScript.id = 'structured-data-organization'
        orgScript.type = 'application/ld+json'
        orgScript.text = JSON.stringify(organization)
        document.head.appendChild(orgScript)

        // Cria e adiciona script de website
        const webScript = document.createElement('script')
        webScript.id = 'structured-data-website'
        webScript.type = 'application/ld+json'
        webScript.text = JSON.stringify(website)
        document.head.appendChild(webScript)

        // Cleanup
        return () => {
            const org = document.getElementById('structured-data-organization')
            const web = document.getElementById('structured-data-website')
            if (org) org.remove()
            if (web) web.remove()
        }
    }, [organization, website])

    return null
}

