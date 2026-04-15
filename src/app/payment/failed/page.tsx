'use client';

import { useRouter } from 'next/navigation';
import { XCircle, ArrowRight, ArrowCounterClockwise } from '@phosphor-icons/react';
import Link from 'next/link';

export default function PaymentFailedPage() {
    const router = useRouter();

    const handleRetry = () => {
        router.push('/dashboard/plans');
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 text-foreground">
            <div className="carbon-card border border-border rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle size={56} className="text-red-600" weight="fill" />
                </div>

                <h1 className="text-3xl font-bold text-foreground mb-3">
                    Payment Failed
                </h1>

                <p className="theme-copy mb-8">
                    We were unable to process your payment. Your subscription has not been changed.
                </p>

                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8">
                    <p className="text-sm text-red-500">
                        <strong>Possible Reasons:</strong><br />
                        - Insufficient funds<br />
                        - Card declined by issuer<br />
                        - Network timeout
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleRetry}
                        className="theme-button-primary flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium"
                    >
                        <ArrowCounterClockwise size={18} weight="bold" />
                        Try Again
                    </button>

                    <Link
                        href="/dashboard"
                        className="theme-button-secondary flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium"
                    >
                        Back to Dashboard
                        <ArrowRight size={18} weight="bold" />
                    </Link>
                </div>

                <p className="text-sm text-muted mt-6">
                    Need help? <a href="mailto:support@example.com" className="text-primary hover:underline">Contact Support</a>
                </p>
            </div>
        </div>
    );
}
