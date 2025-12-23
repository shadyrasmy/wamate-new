'use client';

import { ArrowRight, ShoppingBag, Basket, Storefront, Spinner, PuzzlePiece } from '@phosphor-icons/react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function IntegrationsPage() {
    return (
        <div className="space-y-10 pb-20">
            <div>
                <h1 className="text-4xl font-black tracking-tight mb-2">Integrations Marketplace</h1>
                <p className="text-gray-500 font-medium">Connect WaMate with your favorite e-commerce platforms.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {/* EasyOrders (Active) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="carbon-card p-8 rounded-[2rem] border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent relative group overflow-hidden flex flex-col h-full"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition duration-500 flex-shrink-0">
                        <Storefront size={32} weight="fill" />
                    </div>

                    <div className="mb-8 flex-1">
                        <h3 className="text-2xl font-black mb-2">EasyOrders</h3>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed">
                            Seamlessly sync orders, updates, and customer data directly. The native CRM solution for WaMate.
                        </p>
                    </div>

                    <a
                        href="https://easymatecrm.online"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black rounded-xl font-black uppercase tracking-wider text-xs hover:bg-blue-50 hover:scale-[1.02] transition shadow-xl mt-auto"
                    >
                        Use Now <ArrowRight weight="bold" />
                    </a>
                </motion.div>

                {/* Shopify (Active) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="carbon-card p-8 rounded-[2rem] border-[#96bf48]/20 bg-gradient-to-br from-[#96bf48]/5 to-transparent relative group overflow-hidden flex flex-col h-full"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#96bf48]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="w-14 h-14 bg-[#96bf48] rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-[#96bf48]/20 group-hover:scale-110 transition duration-500 flex-shrink-0">
                        <ShoppingBag size={32} weight="fill" />
                    </div>

                    <div className="mb-8 flex-1">
                        <h3 className="text-2xl font-black mb-2">Shopify</h3>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed">
                            Automated abandoned cart recovery and order notifications for your Shopify store.
                        </p>
                    </div>

                    <a
                        href="https://easymatecrm.online"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black rounded-xl font-black uppercase tracking-wider text-xs hover:bg-green-50 hover:scale-[1.02] transition shadow-xl mt-auto"
                    >
                        Use Now <ArrowRight weight="bold" />
                    </a>
                </motion.div>

                {/* WooCommerce (Active) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="carbon-card p-8 rounded-[2rem] border-[#9b5c8f]/20 bg-gradient-to-br from-[#9b5c8f]/5 to-transparent relative group overflow-hidden flex flex-col h-full"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#9b5c8f]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="w-14 h-14 bg-[#9b5c8f] rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-[#9b5c8f]/20 group-hover:scale-110 transition duration-500 flex-shrink-0">
                        <Basket size={32} weight="fill" />
                    </div>

                    <div className="mb-8 flex-1">
                        <h3 className="text-2xl font-black mb-2">WooCommerce</h3>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed">
                            Connect your WordPress store to send seamless order updates and promotional campaigns.
                        </p>
                    </div>

                    <a
                        href="https://easymatecrm.online"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black rounded-xl font-black uppercase tracking-wider text-xs hover:bg-purple-50 hover:scale-[1.02] transition shadow-xl mt-auto"
                    >
                        Use Now <ArrowRight weight="bold" />
                    </a>
                </motion.div>

                {/* WordPress Plugin (New) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="carbon-card p-8 rounded-[2rem] border-[#21759b]/20 bg-gradient-to-br from-[#21759b]/5 to-transparent relative group overflow-hidden flex flex-col h-full"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#21759b]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="w-14 h-14 bg-[#21759b] rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-[#21759b]/20 group-hover:scale-110 transition duration-500 flex-shrink-0">
                        <PuzzlePiece size={32} weight="fill" />
                    </div>

                    <div className="mb-8 flex-1">
                        <h3 className="text-2xl font-black mb-2">WordPress Plugin</h3>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed">
                            Official companion plugin for Order Confirmation and Status updates.
                        </p>
                    </div>

                    <a
                        href="https://wordpress.org/plugins/wamate-confirm/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black rounded-xl font-black uppercase tracking-wider text-xs hover:bg-blue-50 hover:scale-[1.02] transition shadow-xl mt-auto"
                    >
                        Get Plugin <ArrowRight weight="bold" />
                    </a>
                </motion.div>

                {/* Coming Soon */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="carbon-card p-8 rounded-[2rem] border-white/5 relative group overflow-hidden opacity-50 hover:opacity-100 transition flex flex-col h-full"
                >
                    <div className="w-14 h-14 bg-gray-700 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg flex-shrink-0">
                        <Spinner size={32} weight="bold" className="animate-spin-slow" />
                    </div>

                    <div className="mb-8 flex-1">
                        <div className="flex justify-between items-start">
                            <h3 className="text-2xl font-black mb-2">More...</h3>
                            <span className="bg-white/5 text-gray-400 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest border border-white/5">Soon</span>
                        </div>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed">
                            We are constantly working on new integrations. Stay tuned for Zapier, Magento, and more.
                        </p>
                    </div>

                    <button disabled className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 text-gray-500 rounded-xl font-black uppercase tracking-wider text-xs cursor-not-allowed border border-white/5 mt-auto">
                        In Development
                    </button>
                </motion.div>

            </div>
        </div>
    );
}
