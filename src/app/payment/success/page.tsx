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
                    router.push('/dashboard/subscription');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
                {/* Success Icon */}
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={56} className="text-green-600" weight="fill" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    Payment Successful!
                </h1>

                <p className="text-gray-600 mb-8">
                    Your subscription has been upgraded. You now have access to all your new plan features.
                </p>

                {/* Info Box */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
                    <p className="text-sm text-green-800">
                        <strong>Thank you for your purchase!</strong><br />
                        A confirmation email has been sent to your registered email address.
                    </p>
                </div>

                {/* Redirect Notice */}
                <p className="text-sm text-gray-500 mb-6">
                    Redirecting to dashboard in <span className="font-bold text-gray-700">{countdown}</span> seconds...
                </p>

                {/* Manual Navigation */}
                <Link
                    href="/dashboard/subscription"
                    className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
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
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
