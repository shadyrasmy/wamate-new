'use client';

import { motion } from 'framer-motion';

export default function HowEasySection({ content }: { content?: any }) {
    const defaultContent = {
        title: "Brand Success Stories.",
        case1_brand: "TESLA",
        case1_stat: "92% Automation",
        case1_text: "Implementing WaMate for our customer service simplified the entire delivery process. Automation at its finest.",
        case1_footer: "PRODUCTION LINE AUTOMATION",
        case2_brand: "VOGUE",
        case2_stat: "Media Focus",
        case2_text: "Speed is everything in fashion. WaMate gives us the response time our clients demand.",
        case2_footer: "HIGH-FASHION CUSTOMER CARE"
    };

    const c = content || defaultContent;

    return (
        <section className="py-24 relative overflow-hidden bg-[#0d0a1a]">
            {/* Success Stories */}
            <div className="container mx-auto px-6 mb-32">
                <div className="text-center mb-20">
                    <h5 className="text-primary font-bold tracking-widest uppercase text-sm mb-4">Case Studies</h5>
                    <h2 className="text-4xl lg:text-6xl font-black text-white">{c.title}</h2>
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
                                <div className="text-4xl font-extrabold italic text-red-600 tracking-tighter">{c.case1_brand}</div>
                                <div className="px-4 py-1.5 glass-card rounded-full text-[10px] font-black uppercase text-green-400">{c.case1_stat}</div>
                            </div>
                            <p className="text-xl text-gray-400 mb-10 leading-relaxed font-light">"{c.case1_text}"</p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-1 bg-red-600 rounded"></div>
                                <div className="text-xs font-bold text-gray-600 uppercase">{c.case1_footer}</div>
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
                                <div className="text-4xl font-extrabold italic text-white tracking-widest uppercase">{c.case2_brand}</div>
                                <div className="px-4 py-1.5 glass-card rounded-full text-[10px] font-black uppercase text-purple-400">{c.case2_stat}</div>
                            </div>
                            <p className="text-xl text-gray-400 mb-10 leading-relaxed font-light">"{c.case2_text}"</p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-1 bg-white rounded"></div>
                                <div className="text-xs font-bold text-gray-600 uppercase">{c.case2_footer}</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

        </section>
    );
}
