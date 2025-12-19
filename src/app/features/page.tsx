export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-[#0b0914] flex items-center justify-center text-white p-10">
            <div className="max-w-2xl text-center space-y-6">
                <h1 className="text-5xl font-black italic tracking-tighter">CORE ENGINE.</h1>
                <p className="text-gray-500 font-medium">Zero latency. Infinite scale. Direct WhatsApp integration with high-speed neural processing. Discover why we lead the edge-computing race.</p>
                <div className="pt-10 flex justify-center gap-4">
                    <a href="/" className="px-6 py-3 bg-white/5 rounded-xl border border-white/10 font-bold uppercase tracking-widest text-[10px] hover:bg-white/10 transition">The Hub</a>
                    <a href="/register" className="px-6 py-3 bg-primary rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">Sync Now</a>
                </div>
            </div>
        </div>
    );
}
