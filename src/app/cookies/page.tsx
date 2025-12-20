import Footer from '@/components/layout/Footer';

export default function CookiesPage() {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            <div className="container mx-auto px-6 py-32 max-w-4xl">
                <h1 className="text-5xl font-black mb-12 tracking-tight">Cookie Parameters</h1>

                <div className="space-y-12 text-gray-400 font-medium leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-widest text-sm">01. Session Tracking</h2>
                        <p>
                            We use essential session cookies to maintain your connection to the dashboard and ensure your identity remains verified while navigating the grid. These cookies are mandatory for operational stability.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-widest text-sm">02. Optimization Cookies</h2>
                        <p>
                            Performance cookies allow us to monitor grid health and optimize signal speed. This includes tracking dashboard load times and identifying bottlenecks in neural transmission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-widest text-sm">03. Pixel Alignment</h2>
                        <p>
                            We integrate tracking pixels (like Facebook Pixel) to analyze landing page interaction and signup flows. This helps us refine our communication magnitude and reach relevant node operators. You can opt-out of this tracking via your browser's global privacy settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-widest text-sm">04. Local Storage</h2>
                        <p>
                            Operational tokens and UI preferences are stored in your browser's local storage to ensure a seamless reconnect experience when you return to your workstation.
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
}
