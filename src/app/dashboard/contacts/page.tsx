'use client';

import { useEffect, useState } from 'react';
import { UserCircle, MagnifyingGlass, ArrowsClockwise } from '@phosphor-icons/react';
import { useUI } from '@/context/UIContext';

export default function ContactsPage() {
    const { t } = useUI();
    const [contacts, setContacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        try {
            setLoading(true);
            setContacts([]);
        } catch (error) {
            console.error('Failed to load contacts');
        } finally {
            setLoading(false);
        }
    };

    const filteredContacts = contacts.filter(contact =>
        contact.name?.toLowerCase().includes(search.toLowerCase()) ||
        contact.jid.includes(search)
    );

    return (
        <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blood-red to-insta-orange bg-clip-text text-transparent">
                    {t('dashboard.contacts.title')}
                </h1>
                <button
                    onClick={loadContacts}
                    className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500"
                >
                    <ArrowsClockwise size={24} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            <div className="relative mb-6">
                <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder={t('dashboard.contacts.search')}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blood-red/50 outline-none shadow-sm transition"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
            </div>

            <div className="flex-1 overflow-y-auto bg-white/70 backdrop-blur-md rounded-2xl border border-white/50 shadow-xl p-4">
                {filteredContacts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredContacts.map(contact => (
                            <div key={contact.jid} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white transition border border-transparent hover:border-gray-200">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                    {contact.profile_pic ? (
                                        <img src={contact.profile_pic} alt={contact.name} />
                                    ) : (
                                        <UserCircle size={32} className="text-gray-400" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold truncate">{contact.name || contact.push_name || t('dashboard.contacts.unknown')}</p>
                                    <p className="text-xs text-gray-500 font-mono truncate">{contact.jid.split('@')[0]}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <UserCircle size={64} className="mb-4 opacity-50" />
                        <p>{t('dashboard.contacts.empty_title')}</p>
                        <p className="text-xs mt-2">{t('dashboard.contacts.empty_body')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
