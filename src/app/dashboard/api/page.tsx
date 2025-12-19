'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, Code, PaperPlaneRight, Spinner, TerminalWindow, Books } from '@phosphor-icons/react';
import { fetchWithAuth, API_URL } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import CustomSelect from '@/components/ui/CustomSelect';

import ApiDocs from '@/components/ApiDocs';

export default function ApiPage() {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'docs'>('dashboard');
    const [token, setToken] = useState<string>('');
    const [instances, setInstances] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    // Test Sender State
    const [selectedInstance, setSelectedInstance] = useState('');
    const [testPhone, setTestPhone] = useState('');
    const [testMessage, setTestMessage] = useState('Hello from WaMate API! 🚀');
    const [testType, setTestType] = useState('text');
    const [sending, setSending] = useState(false);
    const [response, setResponse] = useState<any>(null);

    useEffect(() => {
        // Get token from storage
        const storedToken = localStorage.getItem('token');
        if (storedToken) setToken(storedToken);

        // Load instances
        fetchWithAuth('/instances')
            .then(data => {
                setInstances(data.data.instances);
                if (data.data.instances.length > 0) setSelectedInstance(data.data.instances[0].instance_id);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const copyToken = () => {
        navigator.clipboard.writeText(token);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleTestSend = async () => {
        if (!selectedInstance || !testPhone || !testMessage) return;
        setSending(true);
        setResponse(null);

        try {
            const res = await fetchWithAuth('/chat/send', {
                method: 'POST',
                body: JSON.stringify({
                    instanceId: selectedInstance,
                    jid: testPhone.includes('@') ? testPhone : `${testPhone}@s.whatsapp.net`,
                    content: testMessage,
                    type: testType
                })
            });
            setResponse({ status: res.status, body: res });
        } catch (error: any) {
            setResponse({ status: 'Error', body: error.message });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-10 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Developer Console</h1>
                    <p className="text-gray-500 font-medium">Engineer custom integrations and direct channel hooks.</p>
                </div>

                <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'dashboard' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-white'}`}
                    >
                        <div className="flex items-center gap-2">
                            <TerminalWindow size={16} weight="bold" /> Dashboard
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('docs')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'docs' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-white'}`}
                    >
                        <div className="flex items-center gap-2">
                            <Books size={16} weight="bold" /> Documentation
                        </div>
                    </button>
                </div>
            </div>

            {activeTab === 'docs' ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <ApiDocs />
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2 space-y-8">
                        {/* Access Token Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="carbon-card p-10 rounded-[2.5rem] border-white/5 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                            <h2 className="text-2xl font-black mb-2 flex items-center gap-3">
                                <Code className="text-primary" size={28} weight="bold" /> Authentication Key
                            </h2>
                            <p className="text-gray-500 font-medium mb-8">
                                Use this Bearer Token in your request headers to authorize external calls.
                            </p>

                            <div className="relative group">
                                <div className="w-full bg-black/40 border border-white/5 p-6 rounded-2xl font-mono text-sm text-primary/80 break-all pr-20 shadow-inner">
                                    {token || 'LOADING_AUTH_STUB_IDENTITY...'}
                                </div>
                                <button
                                    onClick={copyToken}
                                    className="absolute top-1/2 -translate-y-1/2 right-4 w-12 h-12 flex items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20 hover:scale-110 active:scale-90 transition"
                                >
                                    {copied ? <Check size={20} weight="bold" /> : <Copy size={20} weight="bold" />}
                                </button>
                            </div>
                        </motion.div>

                        {/* Endpoints List */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-black uppercase tracking-widest text-gray-500 ml-2">Active Channel Endpoints</h2>
                            {loading ? (
                                <div className="flex justify-center py-10">
                                    <Spinner size={32} className="animate-spin text-primary" />
                                </div>
                            ) : instances.map((inst, i) => (
                                <motion.div
                                    key={inst.instance_id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="carbon-card p-8 rounded-[2rem] border-white/5 hover:border-primary/20 transition-all group"
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 text-primary font-bold">
                                                {inst.name.charAt(0)}
                                            </div>
                                            <h3 className="font-black text-lg">{inst.name}</h3>
                                        </div>
                                        <span className="text-[10px] font-black tracking-widest bg-white/5 px-3 py-1.5 rounded-lg text-gray-400 border border-white/5 group-hover:text-primary transition">
                                            {inst.instance_id}
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5 font-mono text-[11px] group-hover:border-primary/10 transition">
                                            <span className="px-2 py-0.5 bg-green-500/10 text-green-400 rounded-md border border-green-500/20 font-black">POST</span>
                                            <span className="text-gray-400 truncate">{API_URL}/chat/send</span>
                                        </div>
                                        <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5 font-mono text-[11px] group-hover:border-primary/10 transition">
                                            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20 font-black">GET</span>
                                            <span className="text-gray-400 truncate">{API_URL}/chat/messages</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Test Sender */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="carbon-card p-10 rounded-[2.5rem] border-white/5 h-fit shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-32 h-32 bg-pink-500/5 rounded-full blur-[60px] -translate-y-1/2 -translate-x-1/2"></div>

                        <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                            <PaperPlaneRight className="text-pink-500" size={28} weight="bold" /> Sandbox
                        </h2>

                        <div className="space-y-6">
                            <CustomSelect
                                label="Edge Node"
                                value={selectedInstance}
                                onChange={(val) => setSelectedInstance(val)}
                                placeholder="SELECT CHANNEL"
                                options={instances.map(inst => ({
                                    value: inst.instance_id,
                                    label: inst.name
                                }))}
                            />

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Destination Identity</label>
                                <input
                                    type="text"
                                    placeholder="PHONENUMBER (W/ COUNTRY)"
                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:border-primary/50 transition font-bold"
                                    value={testPhone}
                                    onChange={(e) => setTestPhone(e.target.value)}
                                />
                            </div>

                            <CustomSelect
                                label="Payload Format"
                                value={testType}
                                onChange={(val) => setTestType(val)}
                                options={[
                                    { value: 'text', label: 'STRING_TEXT' },
                                    { value: 'image', label: 'MEDIA_IMAGE_URI' }
                                ]}
                            />

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Message Content</label>
                                <textarea
                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:border-primary/50 transition font-bold h-32 resize-none"
                                    value={testMessage}
                                    onChange={(e) => setTestMessage(e.target.value)}
                                />
                            </div>

                            <button
                                onClick={handleTestSend}
                                disabled={sending || !selectedInstance}
                                className="w-full py-5 bg-gradient-to-r from-primary to-pink-500 text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition flex items-center justify-center gap-3 disabled:opacity-50 uppercase tracking-widest text-xs"
                            >
                                {sending ? <Spinner className="animate-spin" size={20} /> : <PaperPlaneRight weight="bold" size={20} />}
                                Execute Request
                            </button>

                            <AnimatePresence>
                                {response && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-6 bg-black/40 rounded-2xl p-5 font-mono text-[10px] border border-white/5 overflow-hidden"
                                    >
                                        <div className="flex justify-between mb-4 border-b border-white/5 pb-2">
                                            <span className="text-gray-500 uppercase font-black tracking-widest">Network Response</span>
                                            <span className={response.status === 'Error' ? 'text-red-500' : 'text-green-500'}>CODE_{response.status}</span>
                                        </div>
                                        <pre className="text-gray-300 whitespace-pre-wrap">{JSON.stringify(response.body, null, 2)}</pre>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
