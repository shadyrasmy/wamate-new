'use client';

import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, WhatsappLogo, Lightning, ChartLineUp } from '@phosphor-icons/react';
import Link from 'next/link';

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-background">
            {/* Background Glows */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15)_0%,transparent_70%)] pointer-events-none"></div>
            <motion.div
                animate={{ opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"
            />
            <motion.div
                animate={{ opacity: [0.05, 0.1, 0.05] }}
                transition={{ duration: 7, repeat: Infinity, delay: 1 }}
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none"
            />

            <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-20 items-center">

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center lg:text-left"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-6">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        Ultimate WhatsApp CRM
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                        All <span className="text-green-400">WhatsApp</span> <br />
                        in <span className="bg-gradient-to-r from-[#a78bfa] to-[#ec4899] bg-clip-text text-transparent">One Place.</span>
                    </h1>
                    <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0">
                        Connect multiple numbers, automate chat assignments, and manage your entire sales & support team from a single, beautiful dashboard.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                        <Link href="/register" className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-100 transition flex items-center gap-2 shadow-xl shadow-white/10">
                            Start Free Trial <ArrowRight weight="bold" />
                        </Link>
                        <button className="px-8 py-4 carbon-card rounded-full font-bold hover:bg-white/5 transition flex items-center gap-2 border border-white/5 group">
                            <PlayCircle size={24} weight="fill" className="text-primary group-hover:scale-110 transition" />
                            Watch Demo
                        </button>
                    </div>
                </motion.div>

                {/* Hero Animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative flex items-center justify-center h-[500px]"
                >
                    {/* Central Icon */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-20 w-32 h-32 bg-[#25D366] rounded-[2.5rem] flex items-center justify-center shadow-[0_0_80px_rgba(37,211,102,0.4)]"
                    >
                        <WhatsappLogo size={64} weight="fill" className="text-white" />
                    </motion.div>

                    {/* Orbiting Rings */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[300px] h-[300px] border border-white/5 rounded-full absolute"></div>
                        <div className="w-[450px] h-[450px] border border-white/5 rounded-full absolute"></div>
                        <div className="w-[600px] h-[600px] border border-white/[0.02] rounded-full absolute"></div>
                    </div>

                    {/* Orbiting Elements */}
                    <div className="absolute z-10 w-full h-full flex items-center justify-center">
                        {/* Agent Element */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute w-[300px] h-[300px] pointer-events-none"
                        >
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                            >
                                <div className="p-3 carbon-card glass-card rounded-2xl flex items-center gap-3 w-44 border-white/10 shadow-2xl">
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold">AG</div>
                                    <div className="text-[10px]">
                                        <div className="font-bold">Agent assigned</div>
                                        <div className="text-gray-400">Just now • Fast reply</div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Stats Element */}
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                            className="absolute w-[450px] h-[450px] pointer-events-none"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 pointer-events-auto"
                            >
                                <div className="p-3 carbon-card glass-card rounded-2xl flex items-center gap-3 border-white/10 shadow-2xl">
                                    <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                                        <Lightning size={20} weight="bold" />
                                    </div>
                                    <div className="text-[10px]">
                                        <div className="font-bold">Auto-resolved</div>
                                        <div className="text-gray-400">Round Robin</div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
