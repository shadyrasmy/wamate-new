'use client';

import { useState } from 'react';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatWindow from '@/components/chat/ChatWindow';

export default function ChatPage() {
    const [selectedChat, setSelectedChat] = useState<any | null>(null);
    const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleSelectContact = (contact: any) => {
        setSelectedChat(contact);
        setIsSidebarOpen(false); // Close sidebar on mobile after selection
    };

    return (
        <div className="flex h-[calc(100vh-100px)] lg:h-full items-center justify-center p-0 lg:p-8 bg-background">
            <div className="flex w-full max-w-[1400px] h-full lg:h-[90vh] carbon-card rounded-none lg:rounded-[3rem] overflow-hidden border-none lg:border lg:border-white/5 shadow-3xl relative">
                <div className={`${isSidebarOpen ? 'flex' : 'hidden md:flex'} w-full md:w-auto h-full`}>
                    <ChatSidebar
                        onSelectContact={handleSelectContact}
                        selectedInstanceId={selectedInstanceId}
                        onSelectInstance={setSelectedInstanceId}
                    />
                </div>
                <div className={`${!isSidebarOpen ? 'flex' : 'hidden md:flex'} flex-1 h-full min-w-0`}>
                    <ChatWindow
                        key={selectedChat?.jid}
                        chat={selectedChat}
                        instanceId={selectedChat?.instanceId || selectedInstanceId}
                        onBack={() => setIsSidebarOpen(true)}
                    />
                </div>
            </div>
        </div>
    );
}
