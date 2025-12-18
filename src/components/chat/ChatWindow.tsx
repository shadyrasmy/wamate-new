'use client';

import { useState, useEffect, useRef } from 'react';
import {
    PaperPlaneRight, Smiley, Paperclip, Microphone,
    DotsThreeVertical, Phone, VideoCamera, Spinner,
    UserCircle, Circle, X
} from '@phosphor-icons/react';
import MessageBubble from './MessageBubble';
import { fetchWithAuth, SOCKET_URL } from '@/lib/api';
import { io } from 'socket.io-client';

import EmojiPicker, { Theme } from 'emoji-picker-react';

interface ChatWindowProps {
    chat: any | null;
    instanceId: string | null;
}

export default function ChatWindow({ chat, instanceId }: ChatWindowProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [socket, setSocket] = useState<any>(null);

    // UI State
    const [showEmoji, setShowEmoji] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const emojiRef = useRef<HTMLDivElement>(null);

    // Initialize Socket
    useEffect(() => {
        if (!instanceId) return;
        const s = io(SOCKET_URL);
        s.emit('join_instance', instanceId);

        s.on('new_message', (parsedMsg: any) => {
            // Check if it's for current JID (we need to know JID if parsedMsg doesn't have it)
            // Actually, parsedMsg should probably have JID now.
            setMessages(prev => {
                if (prev.find(m => m.id === parsedMsg.id)) return prev;
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
            await fetchWithAuth('/chat/send', {
                method: 'POST',
                body: JSON.stringify({
                    instanceId,
                    jid: chat.jid,
                    content,
                    quotedMessageId
                })
            });
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
            const uploadRes = await import('@/lib/api').then(m => m.uploadFile(file));

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
        }

        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    if (!chat) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#0b0914] relative overflow-hidden">
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
        <div className="flex-1 flex flex-col h-full bg-[#0b0914] relative">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] invert" />

            {/* Header */}
            <div className="h-16 lg:h-20 px-8 bg-[#0d0b1a]/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center z-20 sticky top-0">
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary p-[1px]">
                        <div className="w-full h-full bg-carbon rounded-2xl flex items-center justify-center text-white font-black text-xl overflow-hidden">
                            {chat.name?.charAt(0) || <UserCircle size={32} />}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg flex items-center gap-2">
                            {chat.name}
                            <Circle size={8} weight="fill" className="text-green-500 animate-pulse" />
                        </h3>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest opacity-60">{chat.jid}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 lg:gap-4">
                    {[VideoCamera, Phone].map((Icon, idx) => (
                        <button key={idx} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition border border-white/5">
                            <Icon size={20} weight="bold" />
                        </button>
                    ))}
                    <div className="w-[1px] h-8 bg-white/5 mx-2" />
                    <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition border border-white/5">
                        <DotsThreeVertical size={24} weight="bold" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto custom-scroll p-6 lg:p-10 z-10 space-y-4">
                {loading && <div className="flex justify-center py-10"><Spinner size={32} className="animate-spin text-primary" /></div>}
                {messages.map((msg) => (
                    <MessageBubble key={msg.id} {...msg} onReply={() => setReplyingTo(msg)} />
                ))}
                <div ref={messagesEndRef} />
            </div>

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
        </div>
    );
}
