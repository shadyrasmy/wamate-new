'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PaperPlaneRight, Smiley, Paperclip, Microphone,
    DotsThreeVertical, Phone, VideoCamera, Spinner,
    UserCircle, Circle, X, CaretLeft, Target, ShoppingCart, Robot
} from '@phosphor-icons/react';
import MessageBubble from './MessageBubble';
import { fetchWithAuth, SOCKET_URL } from '@/lib/api';
import { io } from 'socket.io-client';

import EmojiPicker, { Theme } from 'emoji-picker-react';

interface ChatWindowProps {
    chat: any | null;
    instanceId: string | null;
    onBack?: () => void;
}

export default function ChatWindow({ chat, instanceId, onBack }: ChatWindowProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [socket, setSocket] = useState<any>(null);

    // UI State
    const [showEmoji, setShowEmoji] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const emojiRef = useRef<HTMLDivElement>(null);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    // AI/Commerce States
    const [showLeadModal, setShowLeadModal] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [leadForm, setLeadForm] = useState({
        name: chat?.name || '',
        intent: 'sales',
        status: 'New',
        governorate: '',
        city: '',
        phone2: ''
    });
    const [orderForm, setOrderForm] = useState({
        items: '',
        total_price: 0,
        currency: 'USD',
        governorate: '',
        city: '',
        address: '',
        phone2: ''
    });
    const [aiRepliesEnabled, setAiRepliesEnabled] = useState(chat?.ai_replies_enabled ?? true);

    useEffect(() => {
        setAiRepliesEnabled(chat?.ai_replies_enabled ?? true);
    }, [chat?.jid, chat?.ai_replies_enabled]);

    const handleToggleAI = async () => {
        try {
            const newState = !aiRepliesEnabled;
            const res = await fetchWithAuth('/chat/toggle-ai', {
                method: 'PATCH',
                body: JSON.stringify({
                    jid: chat.jid,
                    enabled: newState
                })
            });
            if (res.status === 'success') {
                setAiRepliesEnabled(newState);
            }
        } catch (error) {
            console.error('Failed to toggle AI', error);
        }
    };

    const handleLeadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetchWithAuth('/chat/leads', {
                method: 'POST',
                body: JSON.stringify({
                    jid: chat.jid,
                    instanceId,
                    ...leadForm
                })
            });
            setShowLeadModal(false);
            alert('Contact converted to Lead.');
        } catch (error) {
            console.error('Lead conversion failed', error);
        }
    };

    const handleOrderSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetchWithAuth('/chat/orders', {
                method: 'POST',
                body: JSON.stringify({
                    jid: chat.jid,
                    instanceId,
                    ...orderForm
                })
            });
            setShowOrderModal(false);
            alert('Order created successfully.');
        } catch (error) {
            console.error('Order creation failed', error);
        }
    };

    // Initialize Socket
    useEffect(() => {
        if (!instanceId) return;
        const s = io(SOCKET_URL);
        s.emit('join_instance', instanceId);

        s.on('new_message', (parsedMsg: any) => {
            // 0. Filter by JID to prevent cross-talk
            // The message must belong to the current chat (either from them or from me to them)
            // parsedMsg.key.remoteJid is the standard field for the chat JID in detailed objects, 
            // but we need to check how the backend sends it. 
            // Based on sidebar logic: `msg.senderJid` seems to be the one.
            // Let's rely on checking if the message is intended for this chat.

            // If it's a group, the jid is the group jid.
            // If it's a DM, the jid is the user's jid.

            // 0. Filter by JID to prevent cross-talk
            // We need to match the message to the current active chat.
            // The backend sends 'chatJid' which is the remote JID for both incoming and outgoing messages.
            const msgJid = parsedMsg.chatJid || parsedMsg.jid || parsedMsg.senderJid || parsedMsg.key?.remoteJid;

            // Normalize JIDs (handle @s.whatsapp.net vs @g.us consistency if needed, but simple include check usually works)
            if (msgJid !== chat?.jid && parsedMsg.param !== 'chat') {
                // If the message is not for this chat, ignore it.
                return;
            }

            setMessages(prev => {
                // 1. Check if ID exists (exact match)
                if (prev.some(m => m.id === parsedMsg.id)) return prev;

                // 2. If it's from me, check for a matching optimistic message (temp ID)
                // We match by content and a very close timestamp (within 5 seconds)
                if (parsedMsg.isMe) {
                    const optimisticMsg = prev.find(m =>
                        m.isMe &&
                        m.content === parsedMsg.content &&
                        m.id.length > 20 // optimistic IDs are usually short timestamps, real IDs are long
                    );
                    if (optimisticMsg) {
                        // Replace the temp message with the real one
                        return prev.map(m => m.id === optimisticMsg.id ? parsedMsg : m);
                    }
                }

                return [...prev, parsedMsg];
            });
            scrollToBottom();
        });

        setSocket(s);
        return () => { s.disconnect(); };
    }, [instanceId, chat?.jid]);

    // Close emoji on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
                setShowEmoji(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [emojiRef]);

    // Fetch History
    useEffect(() => {
        if (chat && instanceId) {
            loadMessages();
        }
    }, [chat, instanceId]);

    const loadMessages = async () => {
        setLoading(true);
        try {
            const data = await fetchWithAuth(`/chat/messages?instanceId=${instanceId}&jid=${chat.jid}`);
            setMessages(data.data.messages);
            scrollToBottom();
        } catch (error) {
            console.error('Failed to load messages', error);
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const [replyingTo, setReplyingTo] = useState<any>(null);

    const handleSend = async () => {
        if (!input.trim() || !instanceId || !chat) return;

        const tempId = Date.now().toString();
        const content = input;
        const quotedMessageId = replyingTo?.id;

        const newMsg = {
            id: tempId,
            content,
            isMe: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'grey',
            quotedMessage: replyingTo ? {
                id: replyingTo.id,
                content: replyingTo.content
            } : null
        };

        setMessages(prev => [...prev, newMsg]);
        setInput('');
        setReplyingTo(null);
        setShowEmoji(false);
        scrollToBottom();

        try {
            const res = await fetchWithAuth('/chat/send', {
                method: 'POST',
                body: JSON.stringify({
                    instanceId,
                    jid: chat.jid,
                    content,
                    quotedMessageId
                })
            });

            if (res.status === 'success' && res.data?.key?.id) {
                const realId = res.data.key.id;
                setMessages(prev => {
                    // If the socket already arrived and added/replaced this message, do nothing
                    if (prev.some(m => m.id === realId)) {
                        // But we still need to remove the temp one if it's still there
                        return prev.filter(m => m.id !== tempId);
                    }
                    // Otherwise, upgrade the temp message to real
                    return prev.map(m => m.id === tempId ? { ...m, id: realId, status: 'read' } : m);
                });
            }
        } catch (error) {
            console.error('Failed to send', error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const onEmojiClick = (emojiObject: any) => {
        setInput(prev => prev + emojiObject.emoji);
    };

    const handleAttach = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadProgress(0);
            const { uploadFileWithProgress } = await import('@/lib/api');
            const uploadRes: any = await uploadFileWithProgress(file, (percent) => {
                setUploadProgress(percent);
            });

            setUploadProgress(null); // Clear progress when done

            let type = 'document';
            if (file.type.startsWith('image/')) type = 'image';
            else if (file.type.startsWith('video/')) type = 'video';
            else if (file.type.startsWith('audio/')) type = 'audio';

            await fetchWithAuth('/chat/send', {
                method: 'POST',
                body: JSON.stringify({
                    instanceId,
                    jid: chat.jid,
                    content: '',
                    type,
                    mediaUrl: uploadRes.data.url
                })
            });

            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                content: type === 'image' ? '📷 Image' : (type === 'video' ? '🎥 Video' : '📎 Document'),
                isMe: true,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'grey'
            }]);
        } catch (error) {
            console.error('Upload failed', error);
            setUploadProgress(null);
            alert('Failed to send media. Please try again.');
        }

        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    if (!chat) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-background relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] invert"></div>
                <div className="text-center z-10 px-8">
                    <div className="w-32 h-32 bg-primary/10 rounded-[3rem] mx-auto mb-10 flex items-center justify-center border border-primary/20 shadow-2xl">
                        <PaperPlaneRight size={48} weight="fill" className="text-primary opacity-50" />
                    </div>
                    <h2 className="text-4xl font-black mb-4 tracking-tight">Active Pulse.</h2>
                    <p className="max-w-xs mx-auto text-gray-500 font-medium leading-relaxed">Select a conversation to begin broadcasting messages across the global edge.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-background relative">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] invert" />

            {/* Header */}
            <div className="h-16 lg:h-20 px-4 lg:px-8 bg-carbon/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center z-20 sticky top-0">
                <div className="flex items-center gap-3 lg:gap-5">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:text-white transition border border-white/5 mr-1"
                        >
                            <CaretLeft size={20} weight="bold" />
                        </button>
                    )}
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary p-[1px] flex-shrink-0">
                        <div className="w-full h-full bg-carbon rounded-2xl flex items-center justify-center text-white font-black text-xl overflow-hidden relative">
                            {chat.profilePicUrl ? (
                                <img src={chat.profilePicUrl} alt={chat.name} className="w-full h-full object-cover" />
                            ) : (
                                chat.name?.charAt(0) || <UserCircle size={24} />
                            )}
                        </div>
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-bold text-white text-base lg:text-lg flex items-center gap-2 truncate">
                            {chat.name}
                            <Circle size={6} weight="fill" className="text-green-500 animate-pulse flex-shrink-0" />
                        </h3>
                        <p className="text-[8px] lg:text-[10px] text-gray-500 font-black uppercase tracking-widest opacity-60 truncate">{chat.jid}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 lg:gap-2">
                    {(user?.role === 'admin' || user?.ai_enabled || user?.plan?.ai_enabled) && (
                        <>
                            <button
                                onClick={handleToggleAI}
                                title={aiRepliesEnabled ? 'Silence AI' : 'Active AI'}
                                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all border ${aiRepliesEnabled ? 'bg-primary/10 hover:bg-primary/20 text-primary border-primary/20' : 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]'}`}
                            >
                                <Robot size={22} weight={aiRepliesEnabled ? "fill" : "bold"} />
                            </button>

                            <div className="w-[1px] h-8 bg-white/5 mx-1" />

                            <button
                                onClick={() => {
                                    setLeadForm({ ...leadForm, name: chat?.name || '' });
                                    setShowLeadModal(true);
                                }}
                                title="Create Sales Lead"
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 transition-all border border-orange-500/20"
                            >
                                <Target size={22} weight="bold" />
                            </button>
                            <button
                                onClick={() => setShowOrderModal(true)}
                                title="New Order Pipeline"
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-500 transition-all border border-green-500/20"
                            >
                                <ShoppingCart size={22} weight="bold" />
                            </button>

                            <div className="w-[1px] h-8 bg-white/5 mx-1" />
                        </>
                    )}

                    <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5">
                        <DotsThreeVertical size={24} weight="bold" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto custom-scroll p-6 lg:p-10 z-10 space-y-4">
                {loading && <div className="flex justify-center py-10"><Spinner size={32} className="animate-spin text-primary" /></div>}
                {messages.map((msg) => (
                    <MessageBubble
                        key={msg.id}
                        {...msg}
                        senderProfilePic={msg.senderProfilePic || (!msg.isMe ? chat.profilePicUrl : undefined)}
                        onReply={() => setReplyingTo(msg)}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Progress Bar */}
            {uploadProgress !== null && (
                <div className="absolute top-16 lg:top-20 left-0 right-0 z-30 px-8 py-2 bg-primary/20 backdrop-blur-md border-b border-primary/30 flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{uploadProgress}%</span>
                    <button onClick={() => setUploadProgress(null)} className="text-white/50 hover:text-white transition">
                        <X size={14} weight="bold" />
                    </button>
                </div>
            )}

            {/* Input Area */}
            <div className="p-4 lg:p-6 bg-transparent z-10 relative">
                <div className="max-w-4xl mx-auto flex items-end gap-4">
                    {replyingTo && (
                        <div className="absolute bottom-full left-0 right-0 mb-4 px-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-between group animate-in slide-in-from-bottom-2">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-1 bg-primary h-8 rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
                                <div className="overflow-hidden">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-0.5">Replying to</p>
                                    <p className="text-sm text-gray-400 truncate font-medium italic">"{replyingTo.content}"</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setReplyingTo(null)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
                            >
                                <X size={18} weight="bold" />
                            </button>
                        </div>
                    )}

                    {showEmoji && (
                        <div ref={emojiRef} className="absolute bottom-32 left-8 z-50 shadow-2xl rounded-3xl border border-white/10 overflow-hidden scale-90 origin-bottom-left">
                            <EmojiPicker
                                theme={Theme.DARK}
                                onEmojiClick={onEmojiClick}
                                width={320}
                                height={400}
                            />
                        </div>
                    )}

                    <div className="flex items-center gap-1 glass-card p-2 rounded-2xl border-white/5 shadow-2xl">
                        <button
                            onClick={() => setShowEmoji(!showEmoji)}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl transition ${showEmoji ? 'text-primary bg-primary/10' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <Smiley size={24} weight="bold" />
                        </button>

                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                        <button
                            onClick={handleAttach}
                            className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-300 transition"
                        >
                            <Paperclip size={24} weight="bold" />
                        </button>
                    </div>

                    <div className="flex-1 glass-card rounded-[2rem] border-white/5 flex items-center px-6 py-1 min-h-[56px] shadow-2xl focus-within:border-primary/30 transition">
                        <input
                            type="text"
                            className="flex-1 focus:outline-none text-white bg-transparent font-medium py-3"
                            placeholder="Compose encrypted message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setShowEmoji(false)}
                        />
                    </div>

                    <div className="flex-shrink-0">
                        {input.trim() ? (
                            <button
                                onClick={handleSend}
                                className="w-14 h-14 bg-primary text-white rounded-[1.5rem] flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-xl shadow-primary/20 group"
                            >
                                <PaperPlaneRight size={24} weight="fill" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                            </button>
                        ) : (
                            <button className="w-14 h-14 glass-card border-white/5 text-gray-500 rounded-[1.5rem] flex items-center justify-center hover:text-gray-300 transition">
                                <Microphone size={24} weight="bold" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {/* Modals */}
            <AnimatePresence>
                {showLeadModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-card w-full max-w-md rounded-[2.5rem] p-10 border-white/10"
                        >
                            <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                                <Target size={28} className="text-orange-500" />
                                Convert to Lead
                            </h3>
                            <form onSubmit={handleLeadSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Contact Name</label>
                                    <input
                                        type="text"
                                        value={leadForm.name}
                                        onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Governorate / State</label>
                                    <input
                                        type="text"
                                        value={leadForm.governorate}
                                        onChange={e => setLeadForm({ ...leadForm, governorate: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold"
                                        placeholder="e.g. Cairo"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">City</label>
                                        <input
                                            type="text"
                                            value={leadForm.city}
                                            onChange={e => setLeadForm({ ...leadForm, city: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Alt Phone</label>
                                        <input
                                            type="text"
                                            value={leadForm.phone2}
                                            onChange={e => setLeadForm({ ...leadForm, phone2: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Intent</label>
                                    <select
                                        value={leadForm.intent}
                                        onChange={e => setLeadForm({ ...leadForm, intent: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold focus:outline-none"
                                    >
                                        <option value="sales">Sales Opportunity</option>
                                        <option value="inquiry">General Inquiry</option>
                                        <option value="support">Technical Support</option>
                                    </select>
                                </div>
                                <div className="pt-6 flex gap-4">
                                    <button type="button" onClick={() => setShowLeadModal(false)} className="flex-1 py-4 text-gray-500 font-bold text-xs uppercase bg-white/5 rounded-2xl">Abort</button>
                                    <button type="submit" className="flex-1 bg-orange-500 text-white py-4 rounded-2xl font-black text-xs uppercase">Save Lead</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )
                }

                {
                    showOrderModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="glass-card w-full max-w-md rounded-[2.5rem] p-10 border-white/10"
                            >
                                <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                                    <ShoppingCart size={28} className="text-green-500" />
                                    Create Order
                                </h3>
                                <form onSubmit={handleOrderSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Order Items</label>
                                        <textarea
                                            value={orderForm.items}
                                            onChange={e => setOrderForm({ ...orderForm, items: e.target.value })}
                                            className="w-full h-32 bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold"
                                            placeholder="e.g. 2x Nitro Coffee, 1x Bagel"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Governorate</label>
                                            <input
                                                type="text"
                                                value={orderForm.governorate}
                                                onChange={e => setOrderForm({ ...orderForm, governorate: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">City</label>
                                            <input
                                                type="text"
                                                value={orderForm.city}
                                                onChange={e => setOrderForm({ ...orderForm, city: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Address</label>
                                        <input
                                            type="text"
                                            value={orderForm.address}
                                            onChange={e => setOrderForm({ ...orderForm, address: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Alt Phone</label>
                                            <input
                                                type="text"
                                                value={orderForm.phone2}
                                                onChange={e => setOrderForm({ ...orderForm, phone2: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Total Price</label>
                                            <input
                                                type="number"
                                                value={orderForm.total_price}
                                                onChange={e => setOrderForm({ ...orderForm, total_price: parseFloat(e.target.value) })}
                                                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-6 flex gap-4">
                                        <button type="button" onClick={() => setShowOrderModal(false)} className="flex-1 py-4 text-gray-500 font-bold text-xs uppercase bg-white/5 rounded-2xl">Abort</button>
                                        <button type="submit" className="flex-1 bg-green-500 text-white py-4 rounded-2xl font-black text-xs uppercase">Create Order</button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )
                }
            </AnimatePresence >
        </div >
    );
}
