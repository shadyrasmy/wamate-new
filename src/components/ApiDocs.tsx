'use client';

import { useState } from 'react';
import { CaretDown, Info, Lightning } from '@phosphor-icons/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const endpoints = [
    {
        method: 'POST',
        path: '/chat/send',
        title: 'Send Text Message',
        description: 'Send a text message to a specific phone number.',
        body: {
            instanceId: "uuid-string",
            jid: "1234567890@s.whatsapp.net",
            content: "Hello World",
            type: "text"
        }
    },
    {
        method: 'POST',
        path: '/chat/send',
        title: 'Send Image',
        description: 'Send an image with a caption.',
        body: {
            instanceId: "uuid-string",
            jid: "1234567890@s.whatsapp.net",
            content: "Nice photo!",
            type: "image",
            mediaUrl: "https://example.com/image.jpg"
        }
    },
    {
        method: 'GET',
        path: '/chat/messages',
        title: 'Get Chat History',
        description: 'Retrieve message history for a unified view or specific instance.',
        params: "?instanceId=uuid&jid=1234567890@s.whatsapp.net"
    },
    {
        method: 'GET',
        path: '/instances',
        title: 'List Instances',
        description: 'Get all connected WhatsApp instances and their status.',
    }
];

export default function ApiDocs() {
    return (
        <div className="space-y-10">
            <div className="carbon-card theme-panel-accent p-10 rounded-[2.5rem] border-primary/20 relative overflow-hidden">
                <div className="flex items-start gap-6 relative z-10">
                    <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 text-primary shrink-0">
                        <Lightning size={32} weight="fill" />
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-black text-foreground">Initialization Protocol</h3>
                        <p className="theme-copy-strong font-medium leading-relaxed">
                            All API requests must include your valid <strong className="text-primary">Bearer Token</strong> in the request headers.
                            Unauthorized requests will be rejected by the edge gateway.
                        </p>
                        <div className="bg-surface-dark border border-border p-5 rounded-2xl font-mono text-sm text-green-400 shadow-inner inline-block">
                            Authorization: Bearer YOUR_ACCESS_TOKEN
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-xl font-black uppercase tracking-widest text-muted ml-2">REST Endpoints</h3>
                <div className="space-y-4">
                    {endpoints.map((ep, i) => (
                        <EndpointCard key={i} endpoint={ep} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function EndpointCard({ endpoint }: { endpoint: any }) {
    const [open, setOpen] = useState(false);

    return (
        <div className={`carbon-card rounded-[2rem] border border-border overflow-hidden transition-all duration-500 ${open ? 'border-primary/30 shadow-2xl shadow-primary/5' : 'hover:border-border-strong'}`}>
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-8 text-left transition"
            >
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                    <div className="flex items-center gap-4">
                        <span className={`font-black text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-lg border
                            ${endpoint.method === 'POST' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}
                        `}>
                            {endpoint.method}
                        </span>
                        <span className="font-mono text-foreground font-bold opacity-90">{endpoint.path}</span>
                    </div>
                    <span className="text-muted font-black text-[11px] uppercase tracking-wider">{endpoint.title}</span>
                </div>
                <div className={`w-8 h-8 rounded-full bg-control border border-border flex items-center justify-center text-muted transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
                    <CaretDown size={16} weight="bold" />
                </div>
            </button>

            {open && (
                <div className="px-8 pb-10 border-t border-border pt-8 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-start gap-4">
                        <div className="mt-1 text-primary"><Info size={20} weight="bold" /></div>
                        <p className="theme-copy-strong font-medium text-sm leading-relaxed">{endpoint.description}</p>
                    </div>

                    {endpoint.params && (
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase text-muted tracking-widest ml-1">Query String Parameters</h4>
                            <div className="bg-surface-dark p-4 rounded-xl border border-border font-mono text-sm text-primary/80">
                                {endpoint.params}
                            </div>
                        </div>
                    )}

                    {endpoint.body && (
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase text-muted tracking-widest ml-1">JSON Payload Schema</h4>
                            <div className="rounded-2xl overflow-hidden border border-border shadow-2xl">
                                <SyntaxHighlighter
                                    language="json"
                                    style={vscDarkPlus}
                                    customStyle={{
                                        borderRadius: '0px',
                                        margin: '0',
                                        padding: '1.5rem',
                                        fontSize: '13px',
                                        background: 'var(--surface-dark)'
                                    }}
                                >
                                    {JSON.stringify(endpoint.body, null, 2)}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
