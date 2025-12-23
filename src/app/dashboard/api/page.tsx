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
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Instance Selector Dropdown */}
                            <div className="carbon-card p-2 rounded-2xl border-white/5 bg-black/20">
                                <CustomSelect
                                    label=""
                                    value={selectedInstance}
                                    onChange={setSelectedInstance}
                                    placeholder="Select Active Node"
                                    options={instances.map(inst => ({
                                        value: inst.instance_id,
                                        label: inst.name
                                    }))}
                                />
                            </div>

                            {/* Selected Instance Details Card */}
                            <div className="carbon-card p-10 rounded-[2.5rem] border-white/5 relative overflow-hidden">
                                {selectedInstance && instances.find(i => i.instance_id === selectedInstance) ? (
                                    <>
                                        <div className="flex items-center justify-between mb-10">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-gradient-to-tr from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20 text-white">
                                                    <span className="text-2xl font-black">
                                                        {instances.find(i => i.instance_id === selectedInstance)?.name.charAt(0)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-black text-white">
                                                        {instances.find(i => i.instance_id === selectedInstance)?.name}
                                                    </h3>
                                                    <div className="text-gray-400 font-mono text-sm mt-1">
                                                        {instances.find(i => i.instance_id === selectedInstance)?.phone_number || 'No Linked Number'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                Active
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="space-y-3">
                                                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Instance ID</label>
                                                <div className="relative group">
                                                    <div className="w-full bg-black/40 border border-white/5 p-4 rounded-xl font-mono text-sm text-gray-300 shadow-inner">
                                                        {selectedInstance}
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(selectedInstance);
                                                            // flash copied feedback
                                                        }}
                                                        className="absolute top-1/2 -translate-y-1/2 right-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
                                                        title="Copy Instance ID"
                                                    >
                                                        <Copy size={16} weight="bold" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Access Token</label>
                                                <div className="relative group">
                                                    <div className="w-full bg-black/40 border border-white/5 p-4 rounded-xl font-mono text-sm text-gray-300 shadow-inner truncate pr-16">
                                                        {token}
                                                    </div>
                                                    <button
                                                        onClick={copyToken}
                                                        className="absolute top-1/2 -translate-y-1/2 right-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
                                                        title="Copy Access Token"
                                                    >
                                                        <Copy size={16} weight="bold" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-10 text-gray-500">
                                        <div className="mb-4 flex justify-center opacity-50"><TerminalWindow size={48} weight="duotone" /></div>
                                        <p>Select a node to view connection details</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
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
