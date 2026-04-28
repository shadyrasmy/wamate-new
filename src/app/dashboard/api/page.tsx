'use client';

import { useEffect, useState } from 'react';
import { Copy, PaperPlaneRight, Spinner, TerminalWindow, Books } from '@phosphor-icons/react';
import { fetchWithAuth } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import CustomSelect from '@/components/ui/CustomSelect';
import ApiDocs from '@/components/ApiDocs';
import { useUI } from '@/context/UIContext';

export default function ApiPage() {
    const { t } = useUI();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'docs'>('dashboard');
    const [token, setToken] = useState<string>('');
    const [instances, setInstances] = useState<any[]>([]);
    const [selectedInstance, setSelectedInstance] = useState('');
    const [testPhone, setTestPhone] = useState('');
    const [testMessage, setTestMessage] = useState('Hello from WaMate API!');
    const [testType, setTestType] = useState('text');
    const [sending, setSending] = useState(false);
    const [response, setResponse] = useState<any>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) setToken(storedToken);

        fetchWithAuth('/instances')
            .then(data => {
                setInstances(data.data.instances);
                if (data.data.instances.length > 0) setSelectedInstance(data.data.instances[0].instance_id);
            })
            .catch(console.error);
    }, []);

    const copyToken = () => {
        navigator.clipboard.writeText(token);
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

    const selectedNode = instances.find(instance => instance.instance_id === selectedInstance);

    return (
        <div className="space-y-10 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">{t('dashboard.api.title')}</h1>
                    <p className="theme-copy font-medium">{t('dashboard.api.subtitle')}</p>
                </div>

                <div className="theme-panel flex p-1.5 rounded-2xl backdrop-blur-md">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'dashboard' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted hover:text-foreground'}`}
                    >
                        <div className="flex items-center gap-2">
                            <TerminalWindow size={16} weight="bold" /> {t('dashboard.api.tab_dashboard')}
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('docs')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'docs' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted hover:text-foreground'}`}
                    >
                        <div className="flex items-center gap-2">
                            <Books size={16} weight="bold" /> {t('dashboard.api.tab_docs')}
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
                            <div className="carbon-card p-2 rounded-2xl border border-border bg-surface-inset">
                                <CustomSelect
                                    label=""
                                    value={selectedInstance}
                                    onChange={setSelectedInstance}
                                    placeholder={t('dashboard.api.select_active_node')}
                                    options={instances.map(instance => ({
                                        value: instance.instance_id,
                                        label: instance.name
                                    }))}
                                />
                            </div>

                            <div className="carbon-card p-10 rounded-[2.5rem] border border-border relative overflow-hidden">
                                {selectedInstance && selectedNode ? (
                                    <>
                                        <div className="flex items-center justify-between mb-10">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-gradient-to-tr from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20 text-white">
                                                    <span className="text-2xl font-black">
                                                        {selectedNode.name.charAt(0)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-black text-foreground">
                                                        {selectedNode.name}
                                                    </h3>
                                                    <div className="text-muted font-mono text-sm mt-1">
                                                        {selectedNode.phone_number || t('dashboard.api.no_linked_number')}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                {t('dashboard.api.active')}
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="space-y-3">
                                                <label className="theme-label text-[11px] uppercase tracking-widest ml-1">{t('dashboard.api.instance_id')}</label>
                                                <div className="relative group">
                                                    <div className="w-full bg-surface-dark border border-border p-4 rounded-xl font-mono text-sm text-foreground shadow-inner">
                                                        {selectedInstance}
                                                    </div>
                                                    <button
                                                        onClick={() => navigator.clipboard.writeText(selectedInstance)}
                                                        className="theme-button-secondary absolute top-1/2 -translate-y-1/2 right-3 p-2 rounded-lg text-muted hover:text-foreground"
                                                        title={t('dashboard.api.copy_instance_id')}
                                                    >
                                                        <Copy size={16} weight="bold" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="theme-label text-[11px] uppercase tracking-widest ml-1">{t('dashboard.api.access_token')}</label>
                                                <div className="relative group">
                                                    <div className="w-full bg-surface-dark border border-border p-4 rounded-xl font-mono text-sm text-foreground shadow-inner truncate pr-16">
                                                        {token}
                                                    </div>
                                                    <button
                                                        onClick={copyToken}
                                                        className="theme-button-secondary absolute top-1/2 -translate-y-1/2 right-3 p-2 rounded-lg text-muted hover:text-foreground"
                                                        title={t('dashboard.api.copy_access_token')}
                                                    >
                                                        <Copy size={16} weight="bold" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-10 text-muted">
                                        <div className="mb-4 flex justify-center opacity-50"><TerminalWindow size={48} weight="duotone" /></div>
                                        <p>{t('dashboard.api.select_node_prompt')}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="carbon-card p-10 rounded-[2.5rem] border border-border h-fit shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-32 h-32 bg-pink-500/5 rounded-full blur-[60px] -translate-y-1/2 -translate-x-1/2"></div>

                        <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                            <PaperPlaneRight className="text-pink-500" size={28} weight="bold" /> {t('dashboard.api.sandbox_title')}
                        </h2>

                        <div className="space-y-6">
                            <CustomSelect
                                label={t('dashboard.api.edge_node')}
                                value={selectedInstance}
                                onChange={(value) => setSelectedInstance(value)}
                                placeholder={t('dashboard.api.select_channel')}
                                options={instances.map(instance => ({
                                    value: instance.instance_id,
                                    label: instance.name
                                }))}
                            />

                            <div className="space-y-2">
                                <label className="theme-label text-[10px] uppercase tracking-widest ml-1">{t('dashboard.api.destination_identity')}</label>
                                <input
                                    type="text"
                                    placeholder={t('dashboard.api.phone_placeholder')}
                                    className="theme-input-solid w-full p-4 rounded-2xl focus:outline-none focus:border-primary/50 transition font-bold"
                                    value={testPhone}
                                    onChange={(event) => setTestPhone(event.target.value)}
                                />
                            </div>

                            <CustomSelect
                                label={t('dashboard.api.payload_format')}
                                value={testType}
                                onChange={(value) => setTestType(value)}
                                options={[
                                    { value: 'text', label: t('dashboard.api.payload_text') },
                                    { value: 'image', label: t('dashboard.api.payload_image') }
                                ]}
                            />

                            <div className="space-y-2">
                                <label className="theme-label text-[10px] uppercase tracking-widest ml-1">{t('dashboard.api.message_content')}</label>
                                <textarea
                                    className="theme-input-solid w-full p-4 rounded-2xl focus:outline-none focus:border-primary/50 transition font-bold h-32 resize-none"
                                    value={testMessage}
                                    onChange={(event) => setTestMessage(event.target.value)}
                                />
                            </div>

                            <button
                                onClick={handleTestSend}
                                disabled={sending || !selectedInstance}
                                className="w-full py-5 bg-gradient-to-r from-primary to-pink-500 text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition flex items-center justify-center gap-3 disabled:opacity-50 uppercase tracking-widest text-xs"
                            >
                                {sending ? <Spinner className="animate-spin" size={20} /> : <PaperPlaneRight weight="bold" size={20} />}
                                {t('dashboard.api.execute_request')}
                            </button>

                            <AnimatePresence>
                                {response && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-6 bg-surface-dark rounded-2xl p-5 font-mono text-[10px] border border-border overflow-hidden"
                                    >
                                        <div className="flex justify-between mb-4 border-b border-border pb-2">
                                            <span className="text-muted uppercase font-black tracking-widest">{t('dashboard.api.network_response')}</span>
                                            <span className={response.status === 'Error' ? 'text-red-500' : 'text-green-500'}>CODE_{response.status}</span>
                                        </div>
                                        <pre className="text-foreground whitespace-pre-wrap">{JSON.stringify(response.body, null, 2)}</pre>
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
