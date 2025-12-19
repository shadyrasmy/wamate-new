import { motion } from 'framer-motion';

export default function NumbersSection({ content }: { content?: any }) {
    const defaultContent = {
        title: "GLOBAL INFRASTRUCTURE",
        stat1_title: "99.99%",
        stat1_label: "Uptime Record",
        stat2_title: "24/7",
        stat2_label: "Human Support",
        stat3_title: "<10ms",
        stat3_label: "Global Latency"
    };

    const c = content || defaultContent;

    return (
        <div className="py-24 bg-primary/5 border-y border-primary/10 relative overflow-hidden">
            <div className="container mx-auto px-6 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-4xl lg:text-7xl font-black mb-10 text-white opacity-20 select-none tracking-widest uppercase">{c.title}</h3>
                    <div className="grid md:grid-cols-3 gap-12 w-full max-w-4xl">
                        {[
                            { val: c.stat1_title, label: c.stat1_label },
                            { val: c.stat2_title, label: c.stat2_label },
                            { val: c.stat3_title, label: c.stat3_label }
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="text-4xl lg:text-5xl font-bold mb-2 text-white">{stat.val}</div>
                                <div className="text-[10px] text-primary font-black uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
            {/* Background Marquee Effect */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full opacity-[0.02] pointer-events-none select-none">
                <div className="flex animate-marquee whitespace-nowrap text-[120px] font-black italic">
                    <span className="mx-10 whitespace-nowrap">INFRASTRUCTURE NETWORK NODES SIGNAL TRANSMISSION</span>
                    <span className="mx-10 whitespace-nowrap">INFRASTRUCTURE NETWORK NODES SIGNAL TRANSMISSION</span>
                </div>
            </div>
        </div>
    );
}
