'use client';

import { useState } from 'react';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatWindow from '@/components/chat/ChatWindow';

export default function ChatPage() {
    const [selectedChat, setSelectedChat] = useState<any | null>(null);
    const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);

    return (
        <div className="flex h-full items-center justify-center p-4 lg:p-8 bg-background">
            <div className="flex w-full max-w-[1400px] h-[90vh] carbon-card rounded-[3rem] overflow-hidden border border-white/5 shadow-3xl">
                <ChatSidebar
                    onSelectContact={setSelectedChat}
                    selectedInstanceId={selectedInstanceId}
                    onSelectInstance={setSelectedInstanceId}
                />
                <div className="flex-1 h-full min-w-0">
                    <ChatWindow
                        key={selectedChat?.jid} // Force reset when switching chats
                        chat={selectedChat}
                        instanceId={selectedChat?.instanceId || selectedInstanceId}
                    />
                </div>
            </div>
        </div>
    );
}
