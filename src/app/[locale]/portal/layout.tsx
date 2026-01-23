'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import PortalLayout from '@/components/portal/PortalLayout';

interface CustomerData {
    name: string;
    email: string;
}

export default function PortalLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const locale = useLocale();
    const [customerData, setCustomerData] = useState<CustomerData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('customer_token');

        if (!token) {
            router.push(`/${locale}/portal/login`);
            return;
        }

        // Fetch customer data
        const fetchCustomer = async () => {
            try {
                const response = await fetch('/api/launch/customer/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setCustomerData(data);
                } else {
                    // Token invalid, redirect to login
                    localStorage.removeItem('customer_token');
                    localStorage.removeItem('customer_email');
                    localStorage.removeItem('customer_id');
                    router.push(`/${locale}/portal/login`);
                }
            } catch (error) {
                console.error('Error fetching customer:', error);
            } finally {
                setLoading(false);
            }
        };

        // For now, just use stored email as customer name
        const storedEmail = localStorage.getItem('customer_email');
        if (storedEmail) {
            setCustomerData({ name: storedEmail.split('@')[0], email: storedEmail });
        }
        setLoading(false);
    }, [router, locale]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <PortalLayout customerName={customerData?.name}>
            {children}
        </PortalLayout>
    );
}
