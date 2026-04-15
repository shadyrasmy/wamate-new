import Link from 'next/link';

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center text-foreground p-10">
            <div className="max-w-2xl text-center space-y-6">
                <h1 className="text-5xl font-black italic tracking-tighter">CORE ENGINE.</h1>
                <p className="theme-copy font-medium">
                    Zero latency. Infinite scale. Direct WhatsApp integration with high-speed neural processing. Discover why we lead the edge-computing race.
                </p>
                <div className="pt-10 flex justify-center gap-4">
                    <Link href="/" className="theme-button-secondary px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                        The Hub
                    </Link>
                    <Link href="/register" className="theme-button-primary px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                        Sync Now
                    </Link>
                </div>
            </div>
        </div>
    );
}
