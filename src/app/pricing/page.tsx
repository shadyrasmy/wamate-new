export default function PricingPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center text-foreground p-10">
            <div className="max-w-2xl text-center space-y-6">
                <h1 className="text-5xl font-black italic tracking-tighter">LIQUID CAPACITY.</h1>
                <p className="text-gray-500 font-medium">Our pricing model is engineered for infinite scalability. Contact our architects for a custom cluster quote or start with our Pro Node today.</p>
                <div className="pt-10 flex justify-center">
                    <a href="/register" className="px-8 py-4 bg-primary rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-105 transition">Initialize Node</a>
                </div>
            </div>
        </div>
    );
}
