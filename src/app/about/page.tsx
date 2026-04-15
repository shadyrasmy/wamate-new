import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center text-foreground p-10">
            <div className="max-w-2xl text-center space-y-6">
                <h1 className="text-5xl font-black italic tracking-tighter">THE NEURAL EDGE.</h1>
                <p className="theme-copy font-medium">
                    WaMate is the next-generation communications layer, bridging the gap between legacy mobile networks and advanced artificial intelligence.
                </p>
                <div className="pt-10 flex justify-center">
                    <Link href="/" className="theme-button-secondary px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                        Back to Hub
                    </Link>
                </div>
            </div>
        </div>
    );
}
