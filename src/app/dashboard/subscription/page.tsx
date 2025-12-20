'use client';

import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/api';
import { Crown, CheckCircle, Spinner } from '@phosphor-icons/react';

export default function SubscriptionPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [plans, setPlans] = useState<any[]>([]);
    const [upgradingPlanId, setUpgradingPlanId] = useState<string | null>(null);

    useEffect(() => {
        loadUser();
        loadPlans();
    }, []);

    const loadUser = async () => {
        try {
            const data = await fetchWithAuth('/auth/me');
            setUser(data.data.user);
        } catch (error) {
            console.error('Failed to load user', error);
        } finally {
            setLoading(false);
        }
    };

    const loadPlans = async () => {
        try {
            const data = await fetchWithAuth('/plans');
            setPlans(data.data.plans);
        } catch (error) {
            console.error('Failed to load plans', error);
        }
    };

    const handleUpgrade = async (planId: string) => {
        setUpgradingPlanId(planId);
        try {
            const data = await fetchWithAuth('/payment/create-invoice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan_id: planId })
            });

            if (data.data?.invoice_url) {
                // Redirect to Fawaterak payment page
                window.location.href = data.data.invoice_url;
            } else {
                alert('Failed to create payment invoice. Please try again.');
            }
        } catch (error: any) {
            console.error('Upgrade failed:', error);
            alert(error.message || 'Failed to initiate payment. Please try again.');
        } finally {
            setUpgradingPlanId(null);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading subscription details...</div>;

    const usagePercent = user ? Math.round((user.messages_sent_current_period / user.monthly_message_limit) * 100) : 0;

    // Get current plan name from user's plan relationship
    const currentPlanName = user?.plan?.name?.toLowerCase() || '';

    return (
        <div className="flex-1 p-8 bg-background min-h-screen">
            <h1 className="text-3xl font-light text-gray-900 mb-8 flex items-center gap-3">
                <Crown size={32} className="text-yellow-500" weight="fill" />
                Subscription & Usage
            </h1>

            {/* Current Plan Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-wa-green/10 to-transparent rounded-bl-full -mr-10 -mt-10" />

                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Current Plan</h2>
                    <div className="text-4xl font-bold text-gray-900 capitalize mb-4 flex items-center gap-2">
                        {user?.plan?.name || 'Free'} Plan
                        {currentPlanName === 'pro' && <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full border border-yellow-200">PRO</span>}
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Status</span>
                            <span className="font-semibold text-green-600 flex items-center gap-1"><CheckCircle weight="fill" /> Active</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Renews On</span>
                            <span className="font-medium">
                                {user?.subscription_end_date
                                    ? new Date(user.subscription_end_date).toLocaleDateString()
                                    : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Usage Stats */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Monthly Usage</h2>

                    <div className="mb-6">
                        <div className="flex justify-between mb-2 text-sm">
                            <span className="font-medium text-gray-700">Messages Sent</span>
                            <span className="text-gray-500">{user?.messages_sent_current_period} / {user?.monthly_message_limit}</span>
                        </div>
                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${usagePercent > 90 ? 'bg-red-500' : 'bg-wa-green'}`}
                                style={{ width: `${Math.min(usagePercent, 100)}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-2 text-right">{usagePercent}% Used</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Max Instances</p>
                            <p className="font-semibold text-xl">{user?.max_instances}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Team Seats</p>
                            <p className="font-semibold text-xl">{user?.max_seats}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upgrade Options */}
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan: any) => (
                    <PlanCard
                        key={plan.id}
                        planId={plan.id}
                        name={plan.name}
                        price={`$${plan.price}/mo`}
                        features={[
                            `${plan.max_instances} Instance${plan.max_instances > 1 ? 's' : ''}`,
                            `${plan.monthly_message_limit.toLocaleString()} Messages`,
                            `${plan.max_seats} Team Seat${plan.max_seats > 1 ? 's' : ''}`,
                            plan.description
                        ].filter(Boolean)}
                        current={user?.id_plan === plan.id}
                        recommended={plan.name.toLowerCase() === 'pro'}
                        onUpgrade={handleUpgrade}
                        isUpgrading={upgradingPlanId === plan.id}
                    />
                ))}

                {plans.length === 0 && (
                    <div className="col-span-full py-20 text-center text-gray-400 italic">
                        No additional network tiers available at this moment.
                    </div>
                )}
            </div>
        </div>
    );
}

function PlanCard({ planId, name, price, features, current, recommended, onUpgrade, isUpgrading }: any) {
    return (
        <div className={`p-6 rounded-2xl border transition-all relative ${current ? 'bg-gray-50 border-wa-green ring-1 ring-wa-green' : 'bg-white border-gray-200 hover:shadow-lg'}`}>
            {recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-wa-green to-wa-teal text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    RECOMMENDED
                </div>
            )}

            <h3 className="text-lg font-bold text-gray-900 mb-2">{name}</h3>
            <div className="text-2xl font-light text-gray-600 mb-6">{price}</div>

            <ul className="space-y-3 mb-8">
                {features.map((f: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle size={18} className="text-wa-green shrink-0" weight="fill" />
                        {f}
                    </li>
                ))}
            </ul>

            <button
                disabled={current || isUpgrading}
                onClick={() => !current && !isUpgrading && onUpgrade(planId)}
                className={`w-full py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${current
                    ? 'bg-gray-200 text-gray-500 cursor-default'
                    : isUpgrading
                        ? 'bg-gray-300 text-gray-600 cursor-wait'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
            >
                {isUpgrading && <Spinner size={18} className="animate-spin" />}
                {current ? 'Current Plan' : isUpgrading ? 'Processing...' : 'Upgrade'}
            </button>
        </div>
    );
}
