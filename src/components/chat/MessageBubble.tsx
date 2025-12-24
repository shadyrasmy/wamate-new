import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Checks, FileText, PlayCircle, Microphone, Spinner, ArrowBendUpLeft, Play, Pause } from '@phosphor-icons/react';

interface MessageProps {
    id: string;
    content: string;
    isMe: boolean;
    time: string;
    status?: 'sent' | 'delivered' | 'read' | 'grey';
    type?: string;
    mediaUrl?: string;
    senderName?: string;
    senderJid?: string;
    jid?: string; // Group JID for context
    quotedMessage?: {
        id: string;
        content: string;
    };
    senderProfilePic?: string; // New prop
    reactions?: string[];
    onReply?: () => void;
}

export default function MessageBubble({
    id,
    content,
    isMe,
    time,
    status = 'sent',
    type = 'text',
    mediaUrl,
    senderName,
    senderJid,
    senderProfilePic,
    jid,
    quotedMessage,
    reactions = [],
    onReply
}: MessageProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            const current = audio.currentTime;
            const duration = audio.duration;
            if (duration) {
                setProgress((current / duration) * 100);
            }
        };

        const onEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', onEnded);
        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('ended', onEnded);
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    if (type === 'reaction') return null;

    const isGroup = jid?.endsWith('@g.us');
    const showSender = !isMe && isGroup && senderName;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex mb-4 items-end gap-2 group relative ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
        >
            {/* Avatar */}
            {!isMe && (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 overflow-hidden shadow-md mb-1 pb-0">
                    {senderProfilePic ? (
                        <img src={senderProfilePic} alt="Sender" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-600 text-xs font-bold text-gray-300">
                            {(senderName || '?').charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
            )}

            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[30%] w-fit`}>
                {/* Sender Name (Group Chat) - Moved inside the stack */}
                {showSender && (
                    <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 ml-1 opacity-80">
                        {senderName}
                    </div>
                )}

                {/* Quoted Message */}
                {quotedMessage && (
                    <div className={`mb-1 p-3 rounded-2xl bg-white/5 border-l-4 border-primary/50 text-[11px] text-gray-400 font-medium truncate backdrop-blur-sm max-w-[16rem] ${isMe ? 'ml-auto' : 'mr-auto'}`}>
                        <div className="text-[10px] font-black uppercase text-primary/70 mb-1 tracking-widest">Replying to</div>
                        <div className="truncate italic">"{quotedMessage.content}"</div>
                    </div>
                )}

                <div
                    className={`relative px-4 py-2 shadow-xl rounded-2xl text-[14px] leading-relaxed transition-all 
                    ${isMe
                            ? 'bg-gradient-to-br from-primary to-primary-dark text-white rounded-tr-none shadow-primary/10 border border-white/10'
                            : 'bg-[#1a162d] text-gray-200 rounded-tl-none border border-white/5 backdrop-blur-sm shadow-black/20'
                        }`}
                >
                    {/* Media Content */}
                    {type === 'image' && (
                        <div className="mb-3 rounded-2xl overflow-hidden border border-white/10 group cursor-zoom-in bg-black/20 min-w-[200px]">
                            {mediaUrl ? (
                                <img src={mediaUrl} alt="Payload" className="w-full h-auto object-cover max-h-72 group-hover:scale-105 transition duration-700 ease-out" />
                            ) : (
                                <div className="w-full h-48 flex flex-col items-center justify-center text-gray-500 gap-3">
                                    <Spinner className="animate-spin" size={20} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Awaiting Buffer...</span>
                                </div>
                            )}
                        </div>
                    )}

                    {type === 'video' && (
                        <div className="mb-3 rounded-2xl overflow-hidden border border-white/10 bg-black/40 min-w-[200px]">
                            {mediaUrl ? (
                                <video src={mediaUrl} controls className="w-full h-auto max-h-72" />
                            ) : (
                                <div className="w-full h-48 flex flex-col items-center justify-center text-gray-500 gap-3">
                                    <PlayCircle size={32} weight="duotone" className="opacity-20" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Syncing Stream...</span>
                                </div>
                            )}
                        </div>
                    )}

                    {type === 'audio' && (
                        <div className={`mb-3 flex items-center gap-4 p-3 rounded-2xl border-white/5 min-w-[240px] ${isMe ? 'bg-white/10' : 'bg-white/5'}`}>
                            <button
                                onClick={togglePlay}
                                disabled={!mediaUrl}
                                className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg flex-shrink-0 hover:scale-105 active:scale-95 transition group disabled:opacity-50"
                            >
                                {isPlaying ? (
                                    <Pause size={24} weight="fill" className="text-white" />
                                ) : (
                                    <Play size={24} weight="fill" className="text-white translate-x-0.5" />
                                )}
                            </button>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <Microphone size={14} weight="bold" className="text-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Voice Note</span>
                                    </div>
                                    {!mediaUrl && <Spinner className="animate-spin text-primary" size={12} />}
                                </div>
                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                                    <div
                                        className="h-full bg-primary transition-all duration-100 shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]"
                                        style={{ width: `${progress}%` }}
                                    />
                                    <div
                                        className="absolute top-0 h-full w-0.5 bg-white transition-all duration-100"
                                        style={{ left: `${progress}%` }}
                                    />
                                </div>
                                {mediaUrl && (
                                    <audio ref={audioRef} src={mediaUrl} className="hidden" />
                                )}
                                {!mediaUrl && (
                                    <span className="text-[9px] font-bold text-gray-500 italic uppercase">Syncing voice...</span>
                                )}
                            </div>
                        </div>
                    )}

                    {type === 'document' && (
                        <div className={`mb-3 p-4 rounded-2xl flex items-center gap-4 border border-white/10 ${isMe ? 'bg-white/10' : 'bg-white/5'}`}>
                            <FileText size={32} weight="duotone" className="text-primary" />
                            <div className="flex-1 min-w-0 text-white">
                                <a href={mediaUrl} target="_blank" rel="noopener noreferrer">
                                    <div className="text-xs font-bold truncate">Application/File</div>
                                    <div className="text-[9px] opacity-50 uppercase font-black">Download Asset</div>
                                </a>
                            </div>
                        </div>
                    )}

                    {type === 'sticker' && (
                        <div className="mb-3 rounded-2xl overflow-hidden group cursor-pointer max-w-[150px]">
                            {mediaUrl ? (
                                <img src={mediaUrl} alt="Sticker" className="w-full h-auto object-cover hover:scale-105 transition duration-300" />
                            ) : (
                                <div className="p-4 flex flex-col items-center justify-center text-gray-500 gap-2 bg-white/5">
                                    <Spinner className="animate-spin" size={20} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Sticker...</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Text Content */}
                    {content && type !== 'image' && type !== 'video' && type !== 'audio' && type !== 'document' && type !== 'sticker' && (
                        <p className={`font-medium ${isMe ? 'text-white' : 'text-gray-200'} whitespace-pre-wrap break-words`}>
                            {content}
                        </p>
                    )}
                    {(type === 'image' || type === 'video') && content && content !== '📷 Image' && content !== '🎥 Video' && (
                        <p className={`font-medium mt-2 ${isMe ? 'text-white' : 'text-gray-200'} whitespace-pre-wrap break-words`}>
                            {content}
                        </p>
                    )}

                    {/* Metadata */}
                    <div className={`flex items-center justify-end gap-2 mt-2 text-[9px] font-black uppercase tracking-tighter ${isMe ? 'text-white/60' : 'text-gray-500'}`}>
                        <span>{time}</span>
                        {isMe && (
                            <Checks
                                size={14}
                                weight="bold"
                                className={status === 'read' ? 'text-white' : 'opacity-40'}
                            />
                        )}
                    </div>
                </div>

                {/* Reactions */}
                {reactions.length > 0 && (
                    <div className={`flex gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {reactions.map((r, i) => (
                            <span key={i} className="bg-[#1a162d] border border-white/5 backdrop-blur-md rounded-full px-2 py-1 text-[10px] shadow-lg">
                                {r}
                            </span>
                        ))}
                    </div>
                )}

                {/* Quick Actions */}
                <div className={`absolute top-0 ${isMe ? '-left-10' : '-right-10'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <button
                        onClick={onReply}
                        className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-primary transition-colors"
                        title="Reply"
                    >
                        <ArrowBendUpLeft size={16} weight="bold" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

