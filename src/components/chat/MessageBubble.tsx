import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Checks, FileText, PlayCircle, Microphone, Spinner, ArrowBendUpLeft, Play, Pause, DownloadSimple } from '@phosphor-icons/react';

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

    const toggleAudio = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const formatTime = (timeInSeconds: number) => {
        if (!timeInSeconds || isNaN(timeInSeconds)) return "0:00";
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const escapeHtml = (text: string) => text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const formatInlineText = (text: string) => text
        .replace(/```([\s\S]*?)```/g, '<code class="rounded bg-black/20 px-1.5 py-0.5">$1</code>')
        .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
        .replace(/_(.*?)_/g, '<em>$1</em>')
        .replace(/~(.*?)~/g, '<del>$1</del>');

    const formatMessageText = (text: string) => {
        if (!text) return null;

        const formattedText = escapeHtml(text)
            .split(/(https?:\/\/[^\s]+)/g)
            .map((part) => {
                if (!part) return '';

                if (/^https?:\/\/[^\s]+$/.test(part)) {
                    return `<a href="${part}" target="_blank" rel="noopener noreferrer" class="underline decoration-white/40 underline-offset-2 break-all [overflow-wrap:anywhere]">${part}</a>`;
                }

                return formatInlineText(part);
            })
            .join('')
            .replace(/\n/g, '<br />');

        return (
            <span
                className="break-words [overflow-wrap:anywhere] [word-break:break-word]"
                dangerouslySetInnerHTML={{ __html: formattedText }}
            />
        );
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

            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[70%] min-w-0`}>
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
                        <div className="truncate italic">&quot;{quotedMessage.content}&quot;</div>
                    </div>
                )}

                <div
                    className={`relative max-w-full min-w-0 px-4 py-2 shadow-xl rounded-2xl text-[14px] leading-relaxed transition-all 
                        ${isMe
                            ? 'bg-gradient-to-br from-primary to-primary-dark text-white shadow-primary/20 rounded-tr-sm'
                            : 'bg-white/10 text-gray-100 shadow-black/10 rounded-tl-sm border border-white/5'
                        }
                    `}
                >
                    {type === 'image' && mediaUrl && (
                        <div className="mb-2 relative rounded-xl overflow-hidden cursor-pointer group" onClick={() => window.open(mediaUrl, '_blank')}>
                            <img src={mediaUrl} alt="Message attachment" className="max-w-full h-auto max-h-64 object-contain transition-transform duration-300 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                <span className="text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 bg-white/20 rounded-full">Open Original</span>
                            </div>
                        </div>
                    )}

                    {type === 'audio' && (
                        <div className={`mb-2 flex items-center gap-3 p-3 rounded-2xl min-w-[200px] sm:min-w-[240px] border ${isMe ? 'bg-black/20 border-white/10' : 'bg-white/5 border-white/5 shadow-inner'}`}>
                            <button
                                onClick={toggleAudio}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-lg ${isMe ? 'bg-white text-primary' : 'bg-primary text-white'}`}
                            >
                                {isPlaying ? (
                                    <Pause size={20} weight="fill" />
                                ) : (
                                    <Play size={20} weight="fill" className="translate-x-0.5" />
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
                        </div >
                    )}

                    {
                        type === 'document' && (
                            <div className={`mb-3 p-4 rounded-2xl flex items-center gap-4 border border-white/10 ${isMe ? 'bg-white/10' : 'bg-white/5'}`}>
                                <FileText size={32} weight="duotone" className="text-primary" />
                                <div className="flex-1 min-w-0 text-white">
                                    <a href={mediaUrl} target="_blank" rel="noopener noreferrer">
                                        <div className="text-xs font-bold truncate">Application/File</div>
                                        <div className="text-[9px] opacity-50 uppercase font-black">Download Asset</div>
                                    </a>
                                </div>
                            </div>
                        )
                    }

                    {
                        type === 'sticker' && (
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
                        )
                    }

                    {/* Text Content */}
                    {
                        content && type !== 'image' && type !== 'video' && type !== 'audio' && type !== 'document' && type !== 'sticker' && (
                            <div className={`min-w-0 font-medium ${isMe ? 'text-white' : 'text-gray-200'} whitespace-pre-wrap break-words [overflow-wrap:anywhere] [word-break:break-word]`}>
                                {formatMessageText(content)}
                            </div>
                        )
                    }
                    {
                        (type === 'image' || type === 'video') && content && content !== '📷 Image' && content !== '🎥 Video' && (
                            <div className={`min-w-0 font-medium mt-2 ${isMe ? 'text-white' : 'text-gray-200'} whitespace-pre-wrap break-words [overflow-wrap:anywhere] [word-break:break-word]`}>
                                {formatMessageText(content)}
                            </div>
                        )
                    }

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
                </div >

                {/* Reactions */}
                {
                    reactions.length > 0 && (
                        <div className={`flex gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            {reactions.map((r, i) => (
                                <span key={i} className="bg-[#1a162d] border border-white/5 backdrop-blur-md rounded-full px-2 py-1 text-[10px] shadow-lg">
                                    {r}
                                </span>
                            ))}
                        </div>
                    )
                }

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
            </div >
        </motion.div >
    );
}

