import Footer from '@/components/layout/Footer';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#0b0914] text-white selection:bg-primary/30">
            <div className="container mx-auto px-6 py-32 max-w-4xl">
                <h1 className="text-5xl font-black mb-12 tracking-tight">Terms of Transmission</h1>

                <div className="space-y-12 text-gray-400 font-medium leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-widest text-sm">01. Protocol Usage</h2>
                        <p>
                            By accessing the WaMate grid, you agree to use our neural bridges for legitimate messaging operations only. Spamming, unauthorized signal broadcasting, or any activity that violates the global WhatsApp User Protocols is strictly prohibited and will result in immediate node termination.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-widest text-sm">02. Identity Verification</h2>
                        <p>
                            You must provide accurate intelligence (Name, Email, Phone) during account creation. Maintaining multiple identities to bypass grid limitations is a violation of the service logic.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-widest text-sm">03. Node Responsibility</h2>
                        <p>
                            You are solely responsible for the content transmitted through your nodes. WaMate provides the infrastructure but does not monitor individual signal payloads for compliance, except in cases of automated abuse detection.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-widest text-sm">04. Service Magnitude</h2>
                        <p>
                            Service limits (Instances, Messages, Seats) are defined by your active magnitude tier. Attempting to bypass these limits via technical exploit will result in a permanent ban from the grid.
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
}
