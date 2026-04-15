import Link from 'next/link';
import { WhatsappLogo } from '@phosphor-icons/react/dist/ssr';

export default function Footer() {
    return (
        <footer className="bg-background border-t border-border pt-20 pb-10 overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-tr from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                                <WhatsappLogo size={24} weight="fill" className="text-white" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-foreground">WaMate</span>
                        </div>
                        <p className="theme-copy font-medium text-sm leading-relaxed max-w-xs">
                            Automating human connections through neural WhatsApp integration. Your enterprise gateway to the global messaging grid.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-black text-foreground uppercase tracking-[0.2em]">Operational Links</h4>
                        <ul className="space-y-4">
                            <li><Link href="/about" className="theme-copy hover:text-primary transition text-sm font-medium">Core Intelligence</Link></li>
                            <li><Link href="/features" className="theme-copy hover:text-primary transition text-sm font-medium">Node Capabilities</Link></li>
                            <li><Link href="/pricing" className="theme-copy hover:text-primary transition text-sm font-medium">Signal Magnitudes</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-black text-foreground uppercase tracking-[0.2em]">Compliance Protocols</h4>
                        <ul className="space-y-4">
                            <li><Link href="/privacy" className="theme-copy hover:text-primary transition text-sm font-medium">Privacy Logic</Link></li>
                            <li><Link href="/terms" className="theme-copy hover:text-primary transition text-sm font-medium">Terms of Transmission</Link></li>
                            <li><Link href="/cookies" className="theme-copy hover:text-primary transition text-sm font-medium">Cookie Parameters</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-black text-foreground uppercase tracking-[0.2em]">Neural Support</h4>
                        <p className="theme-copy text-sm font-medium">Encryption enabled 24/7. Monitoring status is stable.</p>
                        <div className="theme-panel flex items-center gap-2 px-4 py-2 rounded-xl w-fit">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Grid Online</span>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-muted text-[10px] font-black uppercase tracking-[0.2em]">
                        © {new Date().getFullYear()} WaMate // Neural Messaging Unit
                    </p>
                </div>
            </div>
        </footer>
    );
}
