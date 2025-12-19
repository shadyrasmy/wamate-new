export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#0b0914] flex items-center justify-center text-white p-10">
            <div className="max-w-2xl text-center space-y-6">
                <h1 className="text-5xl font-black italic tracking-tighter">THE NEURAL EDGE.</h1>
                <p className="text-gray-500 font-medium">WaMate is the next-generation communications layer, bridging the gap between legacy mobile networks and advanced artificial intelligence.</p>
                <div className="pt-10 flex justify-center">
                    <a href="/" className="px-6 py-3 bg-white/5 rounded-xl border border-white/10 font-bold uppercase tracking-widest text-[10px] hover:bg-white/10 transition">Back to Hub</a>
                </div>
            </div>
        </div>
    );
}
