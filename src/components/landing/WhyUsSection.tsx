'use client';

import { motion } from 'framer-motion';
import { Stack, UserSquare, Repeat, ShieldCheck, ChatCircleDots, HardDrives } from '@phosphor-icons/react';

export default function WhyUsSection() {
    const features = [
        {
            icon: Stack,
            title: "Multi-Instance",
            desc: "Connect and manage unlimited WhatsApp numbers in a single dashboard.",
            color: "text-purple-400",
            bg: "bg-purple-600/10",
            border: "hover:border-purple-500/50"
        },
        {
            icon: UserSquare,
            title: "Agent Seats",
            desc: "Create dedicated seats for your support agents. Manage permissions easily.",
            color: "text-pink-400",
            bg: "bg-pink-600/10",
            border: "hover:border-pink-500/50"
        },
        {
            icon: Repeat,
            title: "Round-Robin",
            desc: "Automatically distribute incoming leads among your active agents.",
            color: "text-green-400",
            bg: "bg-green-600/10",
            border: "hover:border-green-500/50"
        },
        {
            icon: ShieldCheck,
            title: "Sticky Assignments",
            desc: "Customers always talk to the same agent, maintaining consistency.",
            color: "text-blue-400",
            bg: "bg-blue-600/10",
            border: "hover:border-blue-500/50"
        },
        {
            icon: ChatCircleDots,
            title: "Auto-Replies",
            desc: "Set up smart welcome messages or away replies for offline hours.",
            color: "text-yellow-400",
            bg: "bg-yellow-600/10",
            border: "hover:border-yellow-500/50"
        },
        {
            icon: HardDrives,
            title: "Persistence",
            desc: "All chats are stored in a central database. No data loss ever.",
            color: "text-red-400",
            bg: "bg-red-600/10",
            border: "hover:border-red-500/50"
        }
    ];

    return (
        <section id="features" className="py-32 relative">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="max-w-2xl"
                    >
                        <h5 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Core Features</h5>
                        <h2 className="text-4xl lg:text-6xl font-bold font-sans text-white">
                            Unleash the full power of <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">WhatsApp.</span>
                        </h2>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-gray-400 max-w-sm mt-6 md:mt-0"
                    >
                        Stop struggling with a single phone. Empower your team with tools built for scale.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`carbon-card p-10 rounded-[2.5rem] group border-white/5 transition-all duration-500 ${feature.border}`}
                        >
                            <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center mb-8 border border-white/5 group-hover:bg-primary transition-all duration-500 shadow-lg`}>
                                <feature.icon size={32} weight="bold" className={`${feature.color} group-hover:text-white transition-colors`} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                            <p className="text-gray-500 leading-relaxed font-sans">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
