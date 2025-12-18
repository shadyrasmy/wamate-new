'use client';

import { motion } from 'framer-motion';

export default function HowEasySection() {
    return (
        <section className="py-24 relative overflow-hidden bg-[#0d0a1a]">
            {/* Success Stories */}
            <div className="container mx-auto px-6 mb-32">
                <div className="text-center mb-20">
                    <h5 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Case Studies</h5>
                    <h2 className="text-4xl lg:text-6xl font-black text-white">Brand Success Stories.</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Tesla Case Study */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="carbon-card p-1 items-center rounded-[3rem] group"
                    >
                        <div className="bg-[#12101b] rounded-[2.9rem] p-12 h-full flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-10">
                                <div className="text-4xl font-extrabold italic text-red-600 tracking-tighter">TESLA</div>
                                <div className="px-4 py-1.5 glass-card rounded-full text-[10px] font-black uppercase text-green-400">92% Automation</div>
                            </div>
                            <p className="text-xl text-gray-400 mb-10 leading-relaxed font-light">"Implementing WaMate for our customer service simplified the entire delivery process. Automation at its finest."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-1bg-red-600 rounded"></div>
                                <div className="text-xs font-bold text-gray-600">PRODUCTION LINE AUTOMATION</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Vogue Case Study */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="carbon-card p-1 items-center rounded-[3rem] group"
                    >
                        <div className="bg-[#12101b] rounded-[2.9rem] p-12 h-full flex flex-col justify-between overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/40 animate-pulse"></div>
                            <div className="flex justify-between items-start mb-10">
                                <div className="text-4xl font-extrabold italic text-white tracking-widest uppercase">VOGUE</div>
                                <div className="px-4 py-1.5 glass-card rounded-full text-[10px] font-black uppercase text-purple-400">Media Focus</div>
                            </div>
                            <p className="text-xl text-gray-400 mb-10 leading-relaxed font-light">"Speed is everything in fashion. WaMate gives us the response time our clients demand."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-1 bg-white rounded"></div>
                                <div className="text-xs font-bold text-gray-600">HIGH-FASHION CUSTOMER CARE</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Global Infrastructure */}
            <div className="py-24 bg-primary/5 border-y border-primary/10">
                <div className="container mx-auto px-6 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-5xl lg:text-8xl font-black mb-10 text-white opacity-20 select-none">GLOBAL.</h3>
                        <div className="grid md:grid-cols-3 gap-12 w-full max-w-4xl">
                            <div>
                                <div className="text-4xl font-bold mb-2 text-white">99.99%</div>
                                <div className="text-[10px] text-primary font-black uppercase tracking-widest">Uptime Record</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold mb-2 text-white">24/7</div>
                                <div className="text-[10px] text-primary font-black uppercase tracking-widest">Human Support</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold mb-2 text-white">&lt;10ms</div>
                                <div className="text-[10px] text-primary font-black uppercase tracking-widest">Global Latency</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
