'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight } from '@phosphor-icons/react';
import Link from 'next/link';
import { useUI } from '@/context/UIContext';

function SuccessContent() {
    const router = useRouter();
    const { t } = useUI();
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
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={56} className="text-green-600" weight="fill" />
                </div>

                <h1 className="text-3xl font-bold text-foreground mb-3">
                    {t('payment.success.title')}
                </h1>

                <p className="theme-copy mb-8">
                    {t('payment.success.body')}
                </p>

                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-8">
                    <p className="text-sm text-green-500">
                        <strong>{t('payment.success.thank_you')}</strong><br />
                        {t('payment.success.confirmation')}
                    </p>
                </div>

                <p className="text-sm text-muted mb-6">
                    {t('payment.success.redirecting', { countdown })}
                </p>

                <Link
                    href="/dashboard/plans"
                    className="theme-button-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium"
                >
                    {t('payment.success.cta')}
                    <ArrowRight size={18} weight="bold" />
                </Link>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    const { t } = useUI();

    return (
        <Suspense fallback={<div className="min-h-screen bg-background text-foreground flex items-center justify-center">{t('common.loading')}</div>}>
            <SuccessContent />
        </Suspense>
    );
}
