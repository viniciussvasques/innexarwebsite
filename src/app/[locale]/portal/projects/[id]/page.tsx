'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import {
    ArrowLeft, Rocket, Clock, Palette, Eye, CheckCircle2,
    Calendar, ExternalLink, FileText, MessageSquare, Download,
    Globe, Settings, AlertCircle
} from 'lucide-react';

interface ProjectDetails {
    id: number;
    name: string;
    status: string;
    progress: number;
    created_at: string;
    expected_delivery: string | null;
    site_url: string | null;
    total_price: number;
    revisions_used: number;
    revisions_included: number;
    onboarding: {
        business_name: string;
        primary_city: string;
        state: string;
        primary_color: string;
    } | null;
}

const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string; step: number }> = {
    pending_payment: { icon: Clock, color: 'yellow', label: 'Pending Payment', step: 0 },
    paid: { icon: CheckCircle2, color: 'blue', label: 'Payment Confirmed', step: 1 },
    onboarding_pending: { icon: FileText, color: 'orange', label: 'Onboarding Required', step: 1 },
    building: { icon: Palette, color: 'purple', label: 'In Development', step: 2 },
    review: { icon: Eye, color: 'cyan', label: 'Ready for Review', step: 3 },
    delivered: { icon: Rocket, color: 'green', label: 'Delivered', step: 4 },
};

const timelineSteps = [
    { step: 1, label: 'Payment Confirmed', icon: CheckCircle2, desc: 'Your order has been confirmed' },
    { step: 2, label: 'Development', icon: Palette, desc: 'Building your website' },
    { step: 3, label: 'Review', icon: Eye, desc: 'Time to review your site' },
    { step: 4, label: 'Launch', icon: Rocket, desc: 'Your website is live!' },
];

export default function ProjectDetailsPage() {
    const locale = useLocale();
    const params = useParams();
    const projectId = params.id as string;

    const [project, setProject] = useState<ProjectDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            const token = localStorage.getItem('customer_token');
            if (!token) return;

            try {
                const response = await fetch('/api/launch/customer/orders', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    const found = data.orders?.find((o: any) => o.id.toString() === projectId);
                    if (found) {
                        setProject({
                            id: found.id,
                            name: found.onboarding?.business_name || `Project #${found.id}`,
                            status: found.status,
                            progress: getProgressFromStatus(found.status),
                            created_at: found.created_at,
                            expected_delivery: found.expected_delivery_date,
                            site_url: found.site_url,
                            total_price: found.total_price,
                            revisions_used: found.revisions_used || 0,
                            revisions_included: found.revisions_included || 3,
                            onboarding: found.onboarding,
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching project:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId]);

    const getProgressFromStatus = (status: string): number => {
        const progressMap: Record<string, number> = {
            pending_payment: 0, paid: 25, onboarding_pending: 25,
            building: 50, review: 75, delivered: 100,
        };
        return progressMap[status] || 0;
    };

    const getColorClasses = (color: string) => {
        const colors: Record<string, { bg: string; border: string; text: string; gradient: string }> = {
            yellow: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400', gradient: 'from-yellow-500 to-orange-500' },
            blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400', gradient: 'from-blue-500 to-cyan-500' },
            orange: { bg: 'bg-orange-500/20', border: 'border-orange-500/30', text: 'text-orange-400', gradient: 'from-orange-500 to-red-500' },
            purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/30', text: 'text-purple-400', gradient: 'from-purple-500 to-pink-500' },
            cyan: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/30', text: 'text-cyan-400', gradient: 'from-cyan-500 to-blue-500' },
            green: { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400', gradient: 'from-green-500 to-emerald-500' },
        };
        return colors[color] || colors.blue;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Project Not Found</h2>
                <p className="text-slate-400 mb-6">The project you're looking for doesn't exist.</p>
                <Link href={`/${locale}/portal/projects`}>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="px-6 py-3 bg-blue-500 rounded-xl text-white font-medium"
                    >
                        Back to Projects
                    </motion.button>
                </Link>
            </div>
        );
    }

    const status = statusConfig[project.status] || statusConfig.building;
    const colors = getColorClasses(status.color);
    const StatusIcon = status.icon;

    return (
        <div className="space-y-8">
            {/* Back Button */}
            <Link href={`/${locale}/portal/projects`}>
                <motion.button
                    whileHover={{ x: -4 }}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Projects
                </motion.button>
            </Link>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                            <StatusIcon className={`w-6 h-6 ${colors.text}`} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">{project.name}</h1>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} ${colors.border} border mt-1`}>
                                {status.label}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    {project.site_url && (
                        <a
                            href={project.site_url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-medium shadow-lg"
                            >
                                <ExternalLink className="w-4 h-4" />
                                View Website
                            </motion.button>
                        </a>
                    )}
                    <Link href={`/${locale}/portal/support`}>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-white font-medium"
                        >
                            <MessageSquare className="w-4 h-4" />
                            Support
                        </motion.button>
                    </Link>
                </div>
            </div>

            {/* Timeline */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8"
            >
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    Project Timeline
                </h2>

                <div className="relative">
                    {timelineSteps.map((step, i) => {
                        const isComplete = project.progress >= (step.step * 25);
                        const isCurrent = Math.ceil(project.progress / 25) === step.step;
                        const Icon = step.icon;

                        return (
                            <div key={step.step} className="flex gap-4 mb-8 last:mb-0">
                                <div className="relative flex flex-col items-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.1 * i }}
                                        className={`w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all duration-300
                      ${isComplete
                                                ? `bg-gradient-to-br ${colors.gradient} shadow-lg`
                                                : isCurrent
                                                    ? 'bg-white/20 ring-4 ring-blue-500/30'
                                                    : 'bg-white/10'
                                            }`}
                                    >
                                        <Icon className={`w-6 h-6 ${isComplete || isCurrent ? 'text-white' : 'text-slate-500'}`} />
                                    </motion.div>
                                    {i < timelineSteps.length - 1 && (
                                        <div className={`w-0.5 h-full absolute top-12 ${isComplete ? 'bg-green-500' : 'bg-white/10'}`} />
                                    )}
                                </div>
                                <div className={`pt-3 ${!isComplete && !isCurrent ? 'opacity-50' : ''}`}>
                                    <h4 className="font-semibold text-white">{step.label}</h4>
                                    <p className="text-sm text-slate-400">{step.desc}</p>
                                    {isCurrent && (
                                        <span className="inline-block mt-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs text-blue-300">
                                            Current Step
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Project Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                >
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-blue-400" />
                        Project Details
                    </h2>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Order ID</span>
                            <span className="text-white font-medium">#{project.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Created</span>
                            <span className="text-white">{new Date(project.created_at).toLocaleDateString()}</span>
                        </div>
                        {project.expected_delivery && (
                            <div className="flex justify-between">
                                <span className="text-slate-400">Expected Delivery</span>
                                <span className="text-white">{new Date(project.expected_delivery).toLocaleDateString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-slate-400">Total Paid</span>
                            <span className="text-green-400 font-bold">${project.total_price}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Revisions</span>
                            <span className="text-white">{project.revisions_used} / {project.revisions_included} used</span>
                        </div>
                    </div>
                </motion.div>

                {/* Business Info */}
                {project.onboarding && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                    >
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-blue-400" />
                            Business Information
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Business Name</span>
                                <span className="text-white font-medium">{project.onboarding.business_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Location</span>
                                <span className="text-white">{project.onboarding.primary_city}, {project.onboarding.state}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Brand Color</span>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-6 h-6 rounded-lg border border-white/20"
                                        style={{ backgroundColor: project.onboarding.primary_color }}
                                    />
                                    <span className="text-white text-sm">{project.onboarding.primary_color}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                <Link href={`/${locale}/portal/support`}>
                    <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-6 text-center transition-all cursor-pointer">
                        <MessageSquare className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                        <h3 className="text-white font-medium">Request Changes</h3>
                        <p className="text-slate-400 text-sm">Ask for revisions</p>
                    </div>
                </Link>
                <Link href={`/${locale}/portal/billing`}>
                    <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-6 text-center transition-all cursor-pointer">
                        <Download className="w-8 h-8 text-green-400 mx-auto mb-3" />
                        <h3 className="text-white font-medium">View Invoice</h3>
                        <p className="text-slate-400 text-sm">Download receipt</p>
                    </div>
                </Link>
                <Link href={`/${locale}/portal/support`}>
                    <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-6 text-center transition-all cursor-pointer">
                        <MessageSquare className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                        <h3 className="text-white font-medium">Get Support</h3>
                        <p className="text-slate-400 text-sm">Contact our team</p>
                    </div>
                </Link>
            </motion.div>
        </div>
    );
}
