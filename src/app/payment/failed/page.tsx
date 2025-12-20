'use client';

import { useRouter } from 'next/navigation';
import { XCircle, ArrowRight, ArrowCounterClockwise } from '@phosphor-icons/react';
import Link from 'next/link';

export default function PaymentFailedPage() {
    const router = useRouter();

    const handleRetry = () => {
        router.push('/dashboard/subscription');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
                {/* Failure Icon */}
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle size={56} className="text-red-600" weight="fill" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    Payment Failed
                </h1>

                <p className="text-gray-600 mb-8">
                    We were unable to process your payment. Your subscription has not been changed.
                </p>

                {/* Info Box */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
                    <p className="text-sm text-red-800">
                        <strong>Possible Reasons:</strong><br />
                        • Insufficient funds<br />
                        • Card declined by issuer<br />
                        • Network timeout
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleRetry}
                        className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                    >
                        <ArrowCounterClockwise size={18} weight="bold" />
                        Try Again
                    </button>

                    <Link
                        href="/dashboard"
                        className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    >
                        Back to Dashboard
                        <ArrowRight size={18} weight="bold" />
                    </Link>
                </div>

                {/* Support Link */}
                <p className="text-sm text-gray-500 mt-6">
                    Need help? <a href="mailto:support@example.com" className="text-blue-600 hover:underline">Contact Support</a>
                </p>
            </div>
        </div>
    );
}
