import { motion } from 'framer-motion';
import { Checks, FileText, PlayCircle, Microphone, Spinner, ArrowBendUpLeft } from '@phosphor-icons/react';

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
    jid,
    quotedMessage,
    reactions = [],
    onReply
}: MessageProps) {
    // Reactions are shown as small overlays or separate messages. 
    // If it's a reaction type, we might want to hide the main bubble if it's just the emoji.
    if (type === 'reaction') {
        return null; // For now, handle via reaction list on the relevant message. 
        // Or if you want to show it as a message:
        // return <div className="text-[10px] text-gray-500 italic mx-auto">Reacted with {content}</div>
    }

    const isGroup = jid?.endsWith('@g.us');
    const showSender = !isMe && isGroup && senderName;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex flex-col mb-4 ${isMe ? 'items-end' : 'items-start'}`}
        >
            <div className={`relative max-w-[85%] sm:max-w-[70%] group`}>

                {/* Sender Name (Group Chat) */}
                {showSender && (
                    <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 ml-1 opacity-80">
                        {senderName}
                    </div>
                )}

                {/* Quoted Message */}
                {quotedMessage && (
                    <div className={`mb-1 p-3 rounded-2xl bg-white/5 border-l-4 border-primary/50 text-[11px] text-gray-400 font-medium truncate backdrop-blur-sm max-w-[90%] ${isMe ? 'ml-auto' : 'mr-auto'}`}>
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
                                <img src={mediaUrl.replace('localhost:3001', 'localhost:3000')} alt="Payload" className="w-full h-auto object-cover max-h-72 group-hover:scale-105 transition duration-700 ease-out" />
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
                                <video src={mediaUrl.replace('localhost:3001', 'localhost:3000')} controls className="w-full h-auto max-h-72" />
                            ) : (
                                <div className="w-full h-48 flex flex-col items-center justify-center text-gray-500 gap-3">
                                    <PlayCircle size={32} weight="duotone" className="opacity-20" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Syncing Stream...</span>
                                </div>
                            )}
                        </div>
                    )}

                    {type === 'audio' && (
                        <div className={`mb-3 flex items-center gap-3 p-3 rounded-2xl border-white/5 ${isMe ? 'bg-white/10' : 'bg-white/5'}`}>
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg flex-shrink-0">
                                <Microphone size={20} weight="fill" className="text-white" />
                            </div>
                            <div className="flex-1">
                                {mediaUrl ? (
                                    <audio src={mediaUrl.replace('localhost:3001', 'localhost:3000')} controls className="w-full h-8 invert opacity-70" />
                                ) : (
                                    <span className="text-[10px] font-bold text-gray-500 italic uppercase">Processing Voice...</span>
                                )}
                            </div>
                        </div>
                    )}

                    {type === 'document' && (
                        <div className={`mb-3 p-4 rounded-2xl flex items-center gap-4 border border-white/10 ${isMe ? 'bg-white/10' : 'bg-white/5'}`}>
                            <FileText size={32} weight="duotone" className="text-primary" />
                            <div className="flex-1 min-w-0 text-white">
                                <a href={mediaUrl?.replace('localhost:3001', 'localhost:3000')} target="_blank" rel="noopener noreferrer">
                                    <div className="text-xs font-bold truncate">Application/File</div>
                                    <div className="text-[9px] opacity-50 uppercase font-black">Download Asset</div>
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Text Content */}
                    {content && type !== 'image' && type !== 'video' && type !== 'audio' && type !== 'document' && (
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

