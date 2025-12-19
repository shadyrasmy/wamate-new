import Link from 'next/link';
import { WhatsappLogo } from '@phosphor-icons/react/dist/ssr';

export default function Footer() {
    return (
        <footer className="bg-[#0b0914] border-t border-white/5 pt-20 pb-10 overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-tr from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                                <WhatsappLogo size={24} weight="fill" className="text-white" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-white">WaMate</span>
                        </div>
                        <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-xs">
                            Automating human connections through neural WhatsApp integration. Your enterprise gateway to the global messaging grid.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">Operational Links</h4>
                        <ul className="space-y-4">
                            <li><Link href="/about" className="text-gray-500 hover:text-primary transition text-sm font-medium">Core Intelligence</Link></li>
                            <li><Link href="/features" className="text-gray-500 hover:text-primary transition text-sm font-medium">Node Capabilities</Link></li>
                            <li><Link href="/pricing" className="text-gray-500 hover:text-primary transition text-sm font-medium">Signal Magnitudes</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">Compliance Protocols</h4>
                        <ul className="space-y-4">
                            <li><Link href="/privacy" className="text-gray-500 hover:text-primary transition text-sm font-medium">Privacy Logic</Link></li>
                            <li><Link href="/terms" className="text-gray-500 hover:text-primary transition text-sm font-medium">Terms of Transmission</Link></li>
                            <li><Link href="/cookies" className="text-gray-500 hover:text-primary transition text-sm font-medium">Cookie Parameters</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">Neural Support</h4>
                        <p className="text-gray-500 text-sm font-medium">Encryption enabled 24/7. Monitoring status is stable.</p>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl w-fit">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Grid Online</span>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">
                        © {new Date().getFullYear()} WaMate // Neural Messaging Unit
                    </p>
                </div>
            </div>
        </footer>
    );
}
