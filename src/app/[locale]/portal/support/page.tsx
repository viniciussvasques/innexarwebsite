'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Clock, CheckCircle2, AlertCircle, Plus } from 'lucide-react';

interface Ticket {
    id: number;
    subject: string;
    status: 'open' | 'pending' | 'resolved';
    created_at: string;
    last_reply: string;
}

// Mock data - will be replaced with API
const mockTickets: Ticket[] = [];

export default function SupportPage() {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        // TODO: Submit to API
        await new Promise(resolve => setTimeout(resolve, 1000));

        setSubject('');
        setMessage('');
        setShowForm(false);
        setSubmitting(false);
    };

    const getStatusConfig = (status: string) => {
        const configs: Record<string, { icon: React.ElementType; color: string; label: string }> = {
            open: { icon: AlertCircle, color: 'blue', label: 'Open' },
            pending: { icon: Clock, color: 'yellow', label: 'Pending Response' },
            resolved: { icon: CheckCircle2, color: 'green', label: 'Resolved' },
        };
        return configs[status] || configs.open;
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Support</h1>
                    <p className="text-slate-400">Get help with your projects and account.</p>
                </div>
                <motion.button
                    onClick={() => setShowForm(!showForm)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-medium"
                >
                    <Plus className="w-4 h-4" />
                    New Ticket
                </motion.button>
            </div>

            {/* New Ticket Form */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                >
                    <h2 className="text-xl font-bold text-white mb-4">Create Support Ticket</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                                placeholder="Brief description of your issue"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                rows={4}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 resize-none"
                                placeholder="Describe your issue in detail..."
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <motion.button
                                type="submit"
                                disabled={submitting}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-medium disabled:opacity-50"
                            >
                                {submitting ? 'Sending...' : 'Submit Ticket'}
                                <Send className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* Tickets List */}
            {mockTickets.length > 0 ? (
                <div className="space-y-4">
                    {mockTickets.map((ticket) => {
                        const status = getStatusConfig(ticket.status);
                        const Icon = status.icon;

                        return (
                            <motion.div
                                key={ticket.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all cursor-pointer"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl bg-${status.color}-500/20 flex items-center justify-center`}>
                                            <Icon className={`w-5 h-5 text-${status.color}-400`} />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-medium">{ticket.subject}</h3>
                                            <p className="text-slate-400 text-sm">Last reply: {ticket.last_reply}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${status.color}-500/20 text-${status.color}-400`}>
                                        {status.label}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center"
                >
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="w-10 h-10 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">No Support Tickets</h2>
                    <p className="text-slate-400 mb-6">You haven't created any support tickets yet.</p>
                    <motion.button
                        onClick={() => setShowForm(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Create Your First Ticket
                    </motion.button>
                </motion.div>
            )}

            {/* Quick Contact */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Quick Contact</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <a
                        href="mailto:support@innexar.com"
                        className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                    >
                        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-white font-medium">Email Support</p>
                            <p className="text-slate-400 text-sm">support@innexar.com</p>
                        </div>
                    </a>
                    <a
                        href="https://wa.me/14074736081"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                    >
                        <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <p className="text-white font-medium">WhatsApp</p>
                            <p className="text-slate-400 text-sm">Quick response</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}
