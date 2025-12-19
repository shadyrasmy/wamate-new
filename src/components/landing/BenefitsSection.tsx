'use client';

import { motion } from 'framer-motion';

export default function BenefitsSection({ content }: { content?: any }) {
    const defaultContent = {
        title: "Data that drives Conversions.",
        subtitle: "Our advanced routing engine doesn't just send messages—it tracks every interaction. See exactly which agent is closing deals and which campaigns are performing.",
        stat1_title: "99.9%",
        stat1_label: "Delivery Rate",
        stat2_title: "< 2s",
        stat2_label: "Avg Response",
        mission_title: "Why We Exist.",
        mission_text: "In the age of scattered attention, WhatsApp is the only place left where people actually listen. We built WaMate to turn this personal connection into a scalable enterprise asset."
    };

    const c = content || defaultContent;

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-6">

                {/* Advanced Analytics Section */}
                <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="carbon-card rounded-[2.5rem] p-10 border-white/5 shadow-2xl overflow-hidden relative"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-2xl font-bold text-white">Advanced Analytics</h3>
                                <p className="text-gray-500">Real-time traffic pulse & team performance.</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="px-4 py-1.5 glass-card rounded-lg text-[10px] font-bold border-white/10 uppercase tracking-widest text-primary">Live Pulse</div>
                            </div>
                        </div>

                        {/* SVG Chart */}
                        <div className="w-full h-[250px] relative">
                            <svg viewBox="0 0 800 200" className="w-full h-full">
                                <defs>
                                    <linearGradient id="g-purple-benefit" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 2 }}
                                    d="M0,150 L50,140 L100,160 L150,120 L200,80 L250,90 L300,40 L350,60 L400,30 L450,70 L500,40 L550,80 L600,30 L650,50 L700,20 L750,40 L800,10"
                                    stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round" fill="none"
                                />
                                <path d="M0,150 L50,140 L100,160 L150,120 L200,80 L250,90 L300,40 L350,60 L400,30 L450,70 L500,40 L550,80 L600,30 L650,50 L700,20 L750,40 L800,10 L800,200 L0,200 Z" fill="url(#g-purple-benefit)" />
                            </svg>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h5 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Intelligence</h5>
                        <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-white">{c.title}</h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-10">
                            {c.subtitle}
                        </p>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <div className="text-3xl font-bold mb-1 text-white">{c.stat1_title}</div>
                                <div className="text-xs text-gray-500 uppercase font-black">{c.stat1_label}</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold mb-1 text-white">{c.stat2_title}</div>
                                <div className="text-xs text-gray-500 uppercase font-black">{c.stat2_label}</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Purpose Section */}
                <div className="py-24 border-y border-white/[0.03]">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl lg:text-7xl font-black mb-12 text-white">
                                {c.mission_title}
                            </h2>
                            <p className="text-2xl text-gray-400 leading-relaxed font-light italic">
                                "{c.mission_text}"
                            </p>
                            <div className="mt-12 flex items-center justify-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold italic">WM</div>
                                <div className="text-left text-sm">
                                    <div className="font-bold text-white">Engineering Team</div>
                                    <div className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Founders Mission</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

            </div>
        </section>
    );
}
