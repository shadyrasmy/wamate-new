'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchWithAuth } from '@/lib/api';
import { SignOut, ChatCircleText, Spinner, User as UserIcon } from '@phosphor-icons/react';
import ChatWindow from '@/components/chat/ChatWindow';

export default function SeatDashboard() {
    const router = useRouter();
    const [chats, setChats] = useState<any[]>([]);
    const [selectedChat, setSelectedChat] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [seat, setSeat] = useState<any>(null);

    useEffect(() => {
        // Load Seat Profile & Chats
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            // Get Seat Profile? (/auth/me endpoint needs to be smart or separate)
            // Currently our /auth/me uses protect middleware which now supports seats.
            // But lets assume we call /seats/manage/ ... wait no, seat portal has different routes?
            // Actually I didn't create a 'getMe' for seat in the public route.
            // But auth middleware works now. so /auth/me might fail if it casts to User model specifically in controller?
            // Let's check auth.controller.js ... it uses User.findByPk. So it will fail for Seat.
            // We need a seat specific me or update getMe.
            // For now, let's just fetch chats.

            // Fetch Seat Profile
            // We can use a new endpoint or inferred. For now, let's just use /seats/status (GET?) or assume we store it.
            // Actually let's use /auth/me since we updated auth logic, but we need to know the endpoint.
            // But wait, I didn't verify if /auth/me returns seat fields.
            // Let's create a quick getMe in seat controller? yes I did export getMe but didn't route it cleanly.
            // I'll assume /seats/status is also GET capable or I just add a fetch.
            // Simpler: Just rely on status being offline initially or fetch from a dedicated route if needed.
            // Let's fetch /seats/manage is for manager. 
            // I'll skip fetching profile for now to save time and just default to 'online' or wait for user to toggle.
            // Wait, I should show real status.
            // I'll add GET /seats/me to seat routes.
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
        const newStatus = seat.status === 'online' ? 'offline' : 'online'; // Simple toggle
        try {
            // Optimistic
            setSeat({ ...seat, status: newStatus });
            await fetchWithAuth('/seats/status', {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus })
            });
        } catch (e) {
            console.error('Failed to update status');
            setSeat({ ...seat, status: seat.status }); // Revert
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#efeae2]"><Spinner className="animate-spin text-wa-green" size={40} /></div>;

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
            {/* Sidebar (List of Assigned Chats) */}
            <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h1 className="font-bold text-gray-700 flex items-center gap-2">
                            <ChatCircleText size={24} className="text-wa-green" />
                            My Chats
                        </h1>
                        <div className="flex items-center gap-2 mt-1 cursor-pointer" onClick={toggleStatus}>
                            <div className={`w-2 h-2 rounded-full ${seat?.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`} />
                            <span className="text-xs text-gray-500 uppercase font-semibold">{seat?.status || 'Offline'}</span>
                        </div>
                    </div>

                    <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition" title="Logout">
                        <SignOut size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {chats.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-sm">
                            No chats assigned yet.
                        </div>
                    ) : (
                        chats.map(chat => (
                            <div
                                key={chat.jid}
                                onClick={() => setSelectedChat(chat)}
                                className={`px-4 py-3 cursor-pointer border-b border-gray-50 transition-colors hover:bg-gray-50
                                    ${selectedChat?.jid === chat.jid ? 'bg-green-50' : ''}
                                `}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-semibold text-gray-900 truncate">{chat.name || chat.push_name || chat.jid}</h3>
                                    <span className="text-xs text-gray-400">
                                        {chat.lastMessage ? new Date(chat.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 truncate">
                                    {chat.lastMessage?.content || 'No messages'}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </aside>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full bg-[#efeae2] relative">
                {selectedChat ? (
                    <ChatWindow
                        chat={selectedChat}
                        instanceId={selectedChat.instance_id}
                    />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
                            <ChatCircleText size={48} className="text-gray-400" opacity={0.5} />
                        </div>
                        <p>Select a chat to start responding.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
