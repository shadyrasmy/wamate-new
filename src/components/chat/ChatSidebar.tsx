'use client';

import { useEffect, useState } from 'react';
import { MagnifyingGlass, UserCircle, Plus, Spinner, WhatsappLogo, Circle, ChatCircleDots } from '@phosphor-icons/react';
import CustomSelect from '@/components/ui/CustomSelect';
import { fetchWithAuth, SOCKET_URL } from '@/lib/api';
import { io } from 'socket.io-client';
import { useUI } from '@/context/UIContext';

interface ChatSidebarProps {
    onSelectContact: (contact: any) => void;
    selectedInstanceId: string | null;
    onSelectInstance: (id: string) => void;
}

export default function ChatSidebar({ onSelectContact, selectedInstanceId, onSelectInstance }: ChatSidebarProps) {
    const { t } = useUI();
    const [instances, setInstances] = useState<any[]>([]);
    const [chats, setChats] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeJid, setActiveJid] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [socket, setSocket] = useState<any>(null);
    const [showNewChat, setShowNewChat] = useState(false);
    const [newChatPhone, setNewChatPhone] = useState('');
    const [activeTab, setActiveTab] = useState<'chats' | 'contacts'>('chats');
    const [contacts, setContacts] = useState<any[]>([]);

    useEffect(() => {
        fetchWithAuth('/instances').then(data => {
            setInstances(data.data.instances);
            if (data.data.instances.length > 0 && !selectedInstanceId) {
                onSelectInstance(data.data.instances[0].instance_id);
            }
        }).catch(error => console.error('Failed to load instances', error));
    }, [onSelectInstance, selectedInstanceId]);

    useEffect(() => {
        if (selectedInstanceId) {
            loadChats(selectedInstanceId);
        }
    }, [selectedInstanceId]);

    useEffect(() => {
        const nextSocket = io(SOCKET_URL);
        setSocket(nextSocket);
        return () => { nextSocket.disconnect(); };
    }, []);

    useEffect(() => {
        if (!socket) return;
        instances.forEach(instance => socket.emit('join_instance', instance.instance_id));

        socket.on('new_message', (message: any) => {
            const jid = message.chatJid || message.senderJid;
            const content = message.content || t('chat.window.document_label');

            let timeObj = new Date();
            if (message.timestamp) {
                timeObj = new Date(message.timestamp);
            } else if (message.time) {
                const parsedTime = new Date(message.time * 1000);
                if (parsedTime.getFullYear() === 1970 && message.time > 2000000000) {
                    const nextDate = new Date(message.time);
                    if (!isNaN(nextDate.getTime())) timeObj = nextDate;
                } else if (!isNaN(parsedTime.getTime())) {
                    timeObj = parsedTime;
                } else {
                    const nextDate = new Date(message.time);
                    if (!isNaN(nextDate.getTime())) timeObj = nextDate;
                }
            }
            if (isNaN(timeObj.getTime())) timeObj = new Date();

            setChats(previous => {
                const existing = previous.findIndex(chat =>
                    chat.jid === jid ||
                    (chat.lid && chat.lid === jid) ||
                    (message.lid && chat.jid === message.lid) ||
                    (message.lid && chat.lid === message.lid)
                );

                if (existing !== -1) {
                    const oldChat = previous[existing];
                    const updatedChat = {
                        ...oldChat,
                        lastMessage: content,
                        time: timeObj,
                        unread: activeJid === jid ? 0 : (oldChat.unread + 1),
                        instanceId: message.instanceId || oldChat.instanceId
                    };
                    const nextChats = [...previous];
                    nextChats.splice(existing, 1);
                    return [updatedChat, ...nextChats];
                }

                return [{
                    jid,
                    name: jid.split('@')[0],
                    lastMessage: content,
                    time: timeObj,
                    unread: 1,
                    instanceId: message.instanceId
                }, ...previous];
            });
        });

        return () => { socket.off('new_message'); };
    }, [socket, instances, activeJid, t]);

    useEffect(() => {
        if (activeTab === 'contacts' && selectedInstanceId) {
            loadContacts(selectedInstanceId);
        }
    }, [activeTab, selectedInstanceId]);

    const loadChats = async (instanceId: string) => {
        setLoading(true);
        try {
            const query = instanceId && instanceId !== 'all' ? `?instanceId=${instanceId}` : '';
            const data = await fetchWithAuth(`/chat/chats${query}`);
            setChats(data.data.chats);
        } catch (error) {
            console.error('Failed to load chats', error);
        } finally {
            setLoading(false);
        }
    };

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

    const handleSelect = (chat: any) => {
        setActiveJid(chat.jid);
        onSelectContact(chat);
    };

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
        setChats(previous => {
            if (previous.find(chat => chat.jid === jid)) return previous;
            return [{ jid, name: newChatPhone, lastMessage: '', time: new Date(), unread: 0 }, ...previous];
        });
        setShowNewChat(false);
        setNewChatPhone('');
    };

    return (
        <div className="w-full md:w-64 lg:w-[300px] flex flex-col border-r border-border bg-carbon h-full relative">
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                            <WhatsappLogo size={18} weight="fill" className="text-primary" />
                        </div>
                        <div className="relative group min-w-[140px]">
                            <CustomSelect
                                value={selectedInstanceId || ''}
                                onChange={(value) => onSelectInstance(value)}
                                placeholder={t('common.select_instance')}
                                options={[
                                    { value: 'all', label: t('chat.sidebar.all_active_chats') },
                                    ...instances.map(instance => ({
                                        value: instance.instance_id,
                                        label: instance.name
                                    }))
                                ]}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowNewChat(true)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-control hover:bg-control-hover text-foreground transition border border-control-border"
                        >
                            <Plus size={18} weight="bold" />
                        </button>
                    </div>
                </div>

                <div className="flex bg-control p-1 rounded-2xl border border-control-border">
                    <button
                        onClick={() => setActiveTab('chats')}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'chats' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted hover:text-foreground'}`}
                    >
                        {t('chat.sidebar.conversations')}
                    </button>
                    <button
                        onClick={() => setActiveTab('contacts')}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'contacts' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted hover:text-foreground'}`}
                    >
                        {t('chat.sidebar.global_contacts')}
                    </button>
                </div>

                <div className="relative">
                    <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                    <input
                        type="text"
                        placeholder={activeTab === 'chats' ? t('chat.sidebar.search_conversations') : t('chat.sidebar.search_contacts')}
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-input border border-input-border rounded-2xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all font-sans"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scroll px-3 pb-8">
                {loading ? (
                    <div className="flex justify-center p-12">
                        <Spinner className="animate-spin text-primary" size={24} />
                    </div>
                ) : filteredList.length === 0 ? (
                    <div className="text-center p-12">
                        <div className="w-16 h-16 bg-control rounded-3xl flex items-center justify-center mx-auto mb-4 border border-control-border">
                            <ChatCircleDots size={32} weight="duotone" className="text-muted" />
                        </div>
                        <p className="text-muted text-sm font-medium">{t('common.no_results')}</p>
                        <p className="text-xs text-muted mt-1 uppercase font-black tracking-widest">{t('chat.sidebar.empty_secondary')}</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {filteredList.map((item) => (
                            <div
                                key={item.jid}
                                onClick={() => handleSelect(item)}
                                className={`flex items-center gap-4 p-4 cursor-pointer transition-all rounded-2xl group ${activeJid === item.jid
                                    ? 'bg-primary/10 border border-primary/20 shadow-lg shadow-primary/10'
                                    : 'border border-transparent hover:bg-control'}`}
                            >
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-control-hover to-control flex-shrink-0 flex items-center justify-center text-sm font-bold text-foreground border border-control-border group-hover:scale-105 transition-transform overflow-hidden">
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
                                        <span className={`font-bold truncate text-[13px] transition-colors ${activeJid === item.jid ? 'text-foreground' : 'text-muted-soft'}`}>
                                            {item.name || item.jid || item.phone || t('chat.sidebar.unknown_user')}
                                        </span>
                                        {activeTab === 'chats' && item.time && (
                                            <span className="text-[9px] font-black text-muted uppercase tracking-tighter">
                                                {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-[11px] text-muted truncate pr-2 group-hover:text-muted-soft transition-colors">
                                            {activeTab === 'chats' ? (item.lastMessage || <span className="italic opacity-50">{t('chat.sidebar.secure_channel')}</span>) : item.jid}
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

            {showNewChat && (
                <div
                    className="absolute inset-0 bg-overlay backdrop-blur-sm z-50 flex flex-col p-8"
                    onClick={() => setShowNewChat(false)}
                >
                    <div
                        className="bg-carbon p-8 rounded-[2.5rem] border border-border shadow-2xl"
                        onClick={event => event.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <Circle size={12} weight="fill" className="text-primary" />
                            {t('chat.sidebar.launch_conversation')}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-muted uppercase tracking-widest mb-2 block">{t('chat.sidebar.phone_identifier')}</label>
                                <input
                                    className="w-full bg-input border border-input-border p-4 rounded-2xl text-foreground focus:outline-none focus:border-primary/50 transition"
                                    placeholder={t('chat.sidebar.phone_placeholder')}
                                    value={newChatPhone}
                                    onChange={event => setNewChatPhone(event.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => setShowNewChat(false)}
                                    className="flex-1 py-4 text-muted font-bold text-sm uppercase tracking-widest"
                                >
                                    {t('common.abort')}
                                </button>
                                <button
                                    onClick={startNewChat}
                                    className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition"
                                >
                                    {t('chat.sidebar.initiate')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
