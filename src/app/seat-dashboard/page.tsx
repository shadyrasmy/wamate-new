'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/lib/api';
import { SignOut, ChatCircleText, Spinner } from '@phosphor-icons/react';
import ChatWindow from '@/components/chat/ChatWindow';
import { useUI } from '@/context/UIContext';

export default function SeatDashboard() {
    const router = useRouter();
    const { t } = useUI();
    const [chats, setChats] = useState<any[]>([]);
    const [selectedChat, setSelectedChat] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [seat, setSeat] = useState<any>(null);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const seatRes = await fetchWithAuth('/seats/me');
            setSeat(seatRes.data.seat);

            const chatRes = await fetchWithAuth('/chat/assigned');
            setChats(chatRes.data.chats);
        } catch (error) {
            console.error('Failed to load dashboard', error);
            router.push('/seat-login');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/seat-login');
    };

    const toggleStatus = async () => {
        if (!seat) return;
        const currentStatus = seat.status;
        const newStatus = currentStatus === 'online' ? 'offline' : 'online';
        try {
            setSeat({ ...seat, status: newStatus });
            await fetchWithAuth('/seats/status', {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus })
            });
        } catch (e) {
            console.error('Failed to update status');
            setSeat({ ...seat, status: currentStatus });
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-background"><Spinner className="animate-spin text-wa-green" size={40} /></div>;
    }

    return (
        <div className="flex h-screen bg-background overflow-hidden font-sans text-foreground">
            <aside className="w-80 bg-surface border-r border-border flex flex-col">
                <div className="p-4 bg-surface-dark border-b border-border flex justify-between items-center">
                    <div>
                        <h1 className="font-bold text-foreground flex items-center gap-2">
                            <ChatCircleText size={24} className="text-wa-green" />
                            {t('seat.dashboard.title')}
                        </h1>
                        <div className="flex items-center gap-2 mt-1 cursor-pointer" onClick={toggleStatus}>
                            <div className={`w-2 h-2 rounded-full ${seat?.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`} />
                            <span className="text-xs text-muted uppercase font-semibold">
                                {seat?.status === 'online' ? t('common.status_online') : t('common.status_offline')}
                            </span>
                        </div>
                    </div>

                    <button onClick={handleLogout} className="p-2 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-full transition" title={t('seat.dashboard.logout')}>
                        <SignOut size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {chats.length === 0 ? (
                        <div className="p-8 text-center text-muted text-sm">
                            {t('seat.dashboard.no_chats')}
                        </div>
                    ) : (
                        chats.map(chat => (
                            <div
                                key={chat.jid}
                                onClick={() => setSelectedChat(chat)}
                                className={`px-4 py-3 cursor-pointer border-b border-border transition-colors hover:bg-control ${selectedChat?.jid === chat.jid ? 'bg-primary/10' : ''}`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-semibold text-foreground truncate">{chat.name || chat.push_name || chat.jid}</h3>
                                    <span className="text-xs text-muted">
                                        {chat.lastMessage ? new Date(chat.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                    </span>
                                </div>
                                <p className="text-sm text-muted truncate">
                                    {chat.lastMessage?.content || t('seat.dashboard.no_messages')}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </aside>

            <div className="flex-1 flex flex-col h-full bg-background relative">
                {selectedChat ? (
                    <ChatWindow
                        chat={selectedChat}
                        instanceId={selectedChat.instance?.instance_id || selectedChat.instanceId}
                    />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted">
                        <div className="w-24 h-24 bg-control rounded-full mb-4 flex items-center justify-center">
                            <ChatCircleText size={48} className="text-muted" opacity={0.5} />
                        </div>
                        <p>{t('common.select_chat')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
