'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight } from '@phosphor-icons/react';
import Link from 'next/link';

function SuccessContent() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push('/dashboard/plans');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 text-foreground">
            <div className="carbon-card border border-border rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
                {/* Success Icon */}
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={56} className="text-green-600" weight="fill" />
                </div>

                <h1 className="text-3xl font-bold text-foreground mb-3">
                    Payment Successful!
                </h1>

                <p className="theme-copy mb-8">
                    Your subscription has been upgraded. You now have access to all your new plan features.
                </p>

                {/* Info Box */}
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-8">
                    <p className="text-sm text-green-500">
                        <strong>Thank you for your purchase!</strong><br />
                        A confirmation email has been sent to your registered email address.
                    </p>
                </div>

                {/* Redirect Notice */}
                <p className="text-sm text-muted mb-6">
                    Redirecting to dashboard in <span className="font-bold text-foreground">{countdown}</span> seconds...
                </p>

                {/* Manual Navigation */}
                <Link
                    href="/dashboard/plans"
                    className="theme-button-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium"
                >
                    Go to Dashboard
                    <ArrowRight size={18} weight="bold" />
                </Link>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background text-foreground flex items-center justify-center">Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
