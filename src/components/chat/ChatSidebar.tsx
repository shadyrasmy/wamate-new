'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlass, UserCircle, Funnel, Plus, CaretDown, Spinner, WhatsappLogo, Circle, ChatCircleDots } from '@phosphor-icons/react';
import CustomSelect from '@/components/ui/CustomSelect';
import { fetchWithAuth, SOCKET_URL } from '@/lib/api';
import { io } from 'socket.io-client';

interface ChatSidebarProps {
    onSelectContact: (contact: any) => void;
    selectedInstanceId: string | null;
    onSelectInstance: (id: string) => void;
}

export default function ChatSidebar({ onSelectContact, selectedInstanceId, onSelectInstance }: ChatSidebarProps) {
    const [instances, setInstances] = useState<any[]>([]);
    const [chats, setChats] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeJid, setActiveJid] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Load Instances
    useEffect(() => {
        fetchWithAuth('/instances').then(data => {
            setInstances(data.data.instances);
            if (data.data.instances.length > 0 && !selectedInstanceId) {
                onSelectInstance(data.data.instances[0].instance_id);
            }
        }).catch(err => console.error('Failed to load instances', err));
    }, []);

    // Load Chats when instance changes
    useEffect(() => {
        if (selectedInstanceId) {
            loadChats(selectedInstanceId);
        }
    }, [selectedInstanceId]);

    const [socket, setSocket] = useState<any>(null);

    // Initialize Socket
    useEffect(() => {
        const s = io(SOCKET_URL);
        setSocket(s);
        return () => { s.disconnect(); };
    }, []);

    // Listen for new messages
    useEffect(() => {
        if (!socket) return;
        instances.forEach(i => socket.emit('join_instance', i.instance_id));

        socket.on('new_message', (msg: any) => {
            // Fix: Use chatJid if available (remote chat), otherwise fallback to senderJid
            // This prevents "me" conversations when sending from phone.
            const jid = msg.chatJid || msg.senderJid;
            const content = msg.content || 'Media';

            // Fix Invalid Date Issue
            // Ensure we have a valid time. If msg.time is a string/number, use it. If invalid, use Date.now()
            let timeObj = new Date();
            if (msg.time) {
                const parsedTime = new Date(msg.time * 1000); // Check if it's unix timestamp (seconds)
                // If year is 1970, maybe it was milliseconds? 
                if (parsedTime.getFullYear() === 1970 && msg.time > 2000000000) {
                    // It was probably milliseconds already, or we multipled too much. 
                    // Common issue. Let's just try `new Date(msg.time)` directly first
                    const d = new Date(msg.time);
                    if (!isNaN(d.getTime())) timeObj = d;
                } else if (!isNaN(parsedTime.getTime())) {
                    timeObj = parsedTime;
                } else {
                    // Try parsing as string if it wasn't a number
                    const d = new Date(msg.time);
                    if (!isNaN(d.getTime())) timeObj = d;
                }
            }
            // Fallback for immediate UI update: just use 'now' if it's a live message
            // Ideally live messages represent 'now' unless they are history syncs.
            if (isNaN(timeObj.getTime())) timeObj = new Date();

            setChats(prev => {
                const existing = prev.findIndex(c => c.jid === jid || (c.lid && c.lid === jid));
                let newChat;

                if (existing !== -1) {
                    const oldChat = prev[existing];
                    newChat = {
                        ...oldChat,
                        lastMessage: content,
                        time: timeObj,
                        unread: (activeJid === jid) ? 0 : (oldChat.unread + 1),
                        instanceId: msg.instanceId || oldChat.instanceId // Update instanceId if present
                    };
                    const newChats = [...prev];
                    newChats.splice(existing, 1);
                    return [newChat, ...newChats];
                } else {
                    newChat = {
                        jid,
                        name: jid.split('@')[0],
                        lastMessage: content,
                        time: timeObj,
                        unread: 1,
                        instanceId: msg.instanceId // Store instanceId
                    };
                    return [newChat, ...prev];
                }
            });
        });

        return () => { socket.off('new_message'); };
    }, [socket, instances, activeJid]);

    const loadChats = async (instanceId: string) => {
        setLoading(true);
        try {
            const query = (instanceId && instanceId !== 'all') ? `?instanceId=${instanceId}` : '';
            const data = await fetchWithAuth(`/chat/chats${query}`);
            setChats(data.data.chats);
        } catch (error) {
            console.error('Failed to load chats', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (chat: any) => {
        setActiveJid(chat.jid);
        onSelectContact(chat);
    };

    const [showNewChat, setShowNewChat] = useState(false);
    const [newChatPhone, setNewChatPhone] = useState('');
    const [activeTab, setActiveTab] = useState<'chats' | 'contacts'>('chats');
    const [contacts, setContacts] = useState<any[]>([]);

    useEffect(() => {
        if (activeTab === 'contacts' && selectedInstanceId) {
            loadContacts(selectedInstanceId);
        }
    }, [activeTab, selectedInstanceId]);

    const filteredList = (activeTab === 'chats' ? chats : contacts).filter(item => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
            item.name?.toLowerCase().includes(search) ||
            item.jid?.toLowerCase().includes(search) ||
            item.phone?.toLowerCase().includes(search) ||
            item.lastMessage?.toLowerCase().includes(search)
        );
    });

    const loadContacts = async (instanceId: string) => {
        setLoading(true);
        try {
            const data = await fetchWithAuth(`/chat/contacts?instanceId=${instanceId}`);
            setContacts(data.data.contacts);
        } catch (error) {
            console.error('Failed to load contacts', error);
        } finally {
            setLoading(false);
        }
    };

    const startNewChat = () => {
        if (!newChatPhone) return;
        const jid = newChatPhone.includes('@') ? newChatPhone : `${newChatPhone}@s.whatsapp.net`;
        onSelectContact({
            jid,
            name: newChatPhone,
            lastMessage: '',
            time: new Date(),
            unread: 0
        });
        setChats(prev => {
            if (prev.find(c => c.jid === jid)) return prev;
            return [{ jid, name: newChatPhone, lastMessage: '', time: new Date(), unread: 0 }, ...prev];
        });
        setShowNewChat(false);
        setNewChatPhone('');
    };

    return (
        <div className="w-full md:w-64 lg:w-[300px] flex flex-col border-r border-border bg-carbon h-full relative">

            {/* Header */}
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                            <WhatsappLogo size={18} weight="fill" className="text-primary" />
                        </div>
                        <div className="relative group min-w-[140px]">
                            <CustomSelect
                                value={selectedInstanceId || ''}
                                onChange={(val) => onSelectInstance(val)}
                                placeholder="Select Instance"
                                options={[
                                    { value: 'all', label: 'ALL ACTIVE CHATS' },
                                    ...instances.map(inst => ({
                                        value: inst.instance_id,
                                        label: inst.name
                                    }))
                                ]}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowNewChat(true)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white transition border border-white/5"
                        >
                            <Plus size={18} weight="bold" />
                        </button>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                    <button
                        onClick={() => setActiveTab('chats')}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'chats' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Conversations
                    </button>
                    <button
                        onClick={() => setActiveTab('contacts')}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'contacts' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Global Contacts
                    </button>
                </div>

                {/* Search */}
                <div className="relative">
                    <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab === 'chats' ? 'conversations' : 'contacts'}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/[0.03] border border-white/5 rounded-2xl text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-sans"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scroll px-3 pb-8">
                {loading ? (
                    <div className="flex justify-center p-12">
                        <Spinner className="animate-spin text-primary" size={24} />
                    </div>
                ) : filteredList.length === 0 ? (
                    <div className="text-center p-12">
                        <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                            <ChatCircleDots size={32} weight="duotone" className="text-gray-500" />
                        </div>
                        <p className="text-gray-500 text-sm font-medium">No results found.</p>
                        <p className="text-xs text-gray-600 mt-1 uppercase font-black tracking-widest">Initialization Required</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {filteredList.map((item) => (
                            <div
                                key={item.jid}
                                onClick={() => handleSelect(item)}
                                className={`flex items-center gap-4 p-4 cursor-pointer transition-all rounded-2xl group ${activeJid === item.jid
                                    ? 'bg-primary/10 border border-primary/20 shadow-lg shadow-black/20'
                                    : 'border border-transparent hover:bg-white/5'}`}
                            >
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex-shrink-0 flex items-center justify-center text-sm font-bold text-white border border-white/10 group-hover:scale-105 transition-transform overflow-hidden">
                                        {item.profilePicUrl ? (
                                            <img src={item.profilePicUrl} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            item.name?.charAt(0) || <UserCircle size={20} />
                                        )}
                                    </div>
                                    {activeTab === 'chats' && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-[2px] border-carbon"></div>}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <span className={`font-bold truncate text-[13px] transition-colors ${activeJid === item.jid ? 'text-white' : 'text-gray-300'}`}>
                                            {item.name || item.jid || item.phone || 'Unknown User'}
                                        </span>
                                        {activeTab === 'chats' && item.time && (
                                            <span className="text-[9px] font-black text-gray-600 uppercase tracking-tighter">
                                                {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-[11px] text-gray-500 truncate pr-2 group-hover:text-gray-400 transition-colors">
                                            {activeTab === 'chats' ? (item.lastMessage || <span className="italic opacity-50">Secure Channel Established</span>) : item.jid}
                                        </p>
                                        {activeTab === 'chats' && item.unread > 0 && (
                                            <span className="min-w-[16px] h-[16px] px-1 rounded-md bg-primary text-white text-[8px] font-black flex items-center justify-center shadow-lg shadow-primary/20">
                                                {item.unread}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* New Chat Backdrop */}
            {showNewChat && (
                <div
                    className="absolute inset-0 bg-carbon/95 backdrop-blur-sm z-50 flex flex-col p-8"
                    onClick={() => setShowNewChat(false)}
                >
                    <div
                        className="bg-carbon p-8 rounded-[2.5rem] border border-white/10 shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <Circle size={12} weight="fill" className="text-primary" />
                            Launch Conversation
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Phone Identifier</label>
                                <input
                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:border-primary/50 transition"
                                    placeholder="e.g. 15551234567"
                                    value={newChatPhone}
                                    onChange={e => setNewChatPhone(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => setShowNewChat(false)}
                                    className="flex-1 py-4 text-gray-500 font-bold text-sm uppercase tracking-widest"
                                >
                                    Abort
                                </button>
                                <button
                                    onClick={startNewChat}
                                    className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition"
                                >
                                    Initiate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
