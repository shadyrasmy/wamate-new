export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center text-foreground p-10">
            <div className="max-w-md w-full text-center space-y-8">
                <h1 className="text-4xl font-black tracking-tighter uppercase italic">Identity Recovery</h1>
                <p className="text-gray-500 font-medium">Enter your transmission ID to receive a bypass cipher. This protocol requires a verified backup frequency.</p>
                <div className="space-y-4">
                    <input type="email" placeholder="Verified Identity (Email)" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white focus:outline-none focus:border-primary/50 transition font-bold" />
                    <button className="w-full py-5 bg-primary rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] transition">Request Cipher</button>
                </div>
                <div className="pt-6">
                    <a href="/login" className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition">Abort Protocol & Return</a>
                </div>
            </div>
        </div>
    );
}
