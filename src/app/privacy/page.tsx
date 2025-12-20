import Footer from '@/components/layout/Footer';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            <div className="container mx-auto px-6 py-32 max-w-4xl">
                <h1 className="text-5xl font-black mb-12 tracking-tight">Privacy Logic</h1>

                <div className="space-y-12 text-gray-400 font-medium leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-widest text-sm">01. Signal Intelligence</h2>
                        <p>
                            WaMate operates as a neural gateway for WhatsApp automation. We collect specific data points to ensure stable node transmission, including your name, verified email, and operational phone number. This data is strictly used for identity verification and service stability.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-widest text-sm">02. Node Messaging Protocols</h2>
                        <p>
                            Your WhatsApp messages flow through your own instances. We do not store message content unless you have explicitly enabled **Chat Logging** for your node. Even when enabled, data is encrypted and linked only to your verified identity hub.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-widest text-sm">03. Verification Data</h2>
                        <p>
                            Your phone number is required during initialization to prevent unauthorized node access and to provide critical signal alerts via neural SMS or WhatsApp notifications. We do not share your number with 3rd party grid entities.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-widest text-sm">04. Encryption Standards</h2>
                        <p>
                            All data transmissions between your local environment and our API clusters are protected via end-to-end TLS encryption. Access tokens are generated locally and stored securely within your node configuration.
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
}
