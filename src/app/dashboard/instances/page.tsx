'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash, QrCode, WifiHigh, WifiSlash, Spinner, DeviceMobile, Broadcast, X, PencilSimple, ArrowClockwise, Copy, CheckCircle } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchWithAuth, SOCKET_URL } from '@/lib/api';
import { io } from 'socket.io-client';
import { QRCodeSVG } from 'qrcode.react';

import { useUI } from '@/context/UIContext';

export default function InstancesPage() {
    const { t } = useUI();
    const [instances, setInstances] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showQR, setShowQR] = useState(false);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [socket, setSocket] = useState<any>(null);
    const [editingInstance, setEditingInstance] = useState<any>(null);
    const [newName, setNewName] = useState('');
    const [connectionMethod, setConnectionMethod] = useState<'qr' | 'pairing'>('qr');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [pairingCode, setPairingCode] = useState<string | null>(null);
    const [pairingLoading, setPairingLoading] = useState(false);
    const [newInstanceId, setNewInstanceId] = useState<string | null>(null);
    const [pairingCopied, setPairingCopied] = useState(false);

    // Initialize Socket
    useEffect(() => {
        const s = io(SOCKET_URL);
        setSocket(s);
        return () => { s.disconnect(); };
    }, []);

    // Fetch Instances
    useEffect(() => {
        loadInstances();
    }, []);

    const loadInstances = async () => {
        try {
            const data = await fetchWithAuth('/instances');
            setInstances(data.data.instances);
        } catch (error) {
            console.error('Failed to load instances', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateInstance = async () => {
        try {
            setQrCode(null);
            setShowQR(true);

            const res = await fetchWithAuth('/instances', {
                method: 'POST',
                body: JSON.stringify({ instanceName: `WhatsApp Node ${instances.length + 1}` })
            });

            const { instanceId } = res.data;
            setNewInstanceId(instanceId);

            socket.emit('join_instance', instanceId);
            socket.on('qr', ({ qr }: { qr: string }) => {
                if (connectionMethod === 'qr') setQrCode(qr);
            });
            socket.on('connection_update', ({ status, name: updatedName }: { status: string, name?: string }) => {
                if (status === 'connected') {
                    setShowQR(false);
                    loadInstances();
                }
            });

        } catch (error) {
            console.error('Create instance failed', error);
            alert('Channel capacity reached for your tier.');
            setShowQR(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Abort session? This will disconnect the channel link.')) return;

        try {
            await fetchWithAuth(`/instances/${id}`, { method: 'DELETE' });
            setInstances(prev => prev.filter(i => i.instance_id !== id));
        } catch (error) {
            alert('Failed to terminate session.');
        }
    };

    const handleReconnect = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setNewInstanceId(id);
        setQrCode(null);
        setPairingCode(null);
        setConnectionMethod('qr');
        setShowQR(true);
        try {
            await fetchWithAuth(`/instances/${id}/reconnect`, { method: 'POST' });
            socket.emit('join_instance', id);
        } catch (error) {
            console.error('Reconnect failed', error);
        }
    };

    const handleRequestPairingCode = async () => {
        if (!phoneNumber || !newInstanceId) return;
        setPairingLoading(true);
        try {
            const res = await fetchWithAuth(`/instances/${newInstanceId}/pairing-code`, {
                method: 'POST',
                body: JSON.stringify({ phoneNumber })
            });
            setPairingCode(res.data.code);
        } catch (error) {
            console.error('Pairing code request failed', error);
            alert('Failed to generate pairing code. Ensure the instance is ready.');
        } finally {
            setPairingLoading(false);
        }
    };

    const copyPairingCode = () => {
        if (!pairingCode) return;

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(pairingCode);
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = pairingCode;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            textArea.style.top = "0";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
            } catch (err) {
                console.error('Fallback copy failed', err);
            }
            document.body.removeChild(textArea);
        }

        setPairingCopied(true);
        setTimeout(() => setPairingCopied(false), 2000);
    };

    const handleRename = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetchWithAuth(`/instances/${editingInstance.instance_id}`, {
                method: 'PATCH',
                body: JSON.stringify({ name: newName })
            });
            setEditingInstance(null);
            loadInstances();
        } catch (error) {
            alert('Failed to rename instance');
        }
    };

    if (loading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <Spinner size={40} className="animate-spin text-primary" weight="bold" />
        </div>
    );

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Channel Registry</h1>
                    <p className="text-gray-500 font-medium">Manage your active WhatsApp edge nodes and identities.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateInstance}
                    className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-3"
                >
                    <Plus size={20} weight="bold" />
                    {t('provision_node')}
                </motion.button>
            </div>

            {/* Instance List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {instances.map((instance, i) => (
                    <motion.div
                        key={instance.instance_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="carbon-card p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group hover:border-primary/30 transition-all duration-500 shadow-2xl"
                    >
                        {/* Card Glow */}
                        <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] transition-all duration-500 ${instance.status === 'connected' ? 'bg-green-500/10 group-hover:bg-green-500/20' : 'bg-red-500/10 group-hover:bg-red-500/20'}`} />

                        <div className="flex items-start justify-between relative z-10 mb-8 gap-4">
                            <div className="flex items-center gap-5 min-w-0">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shrink-0 transition-all duration-500 ${instance.status === 'connected'
                                    ? 'bg-green-500/5 border-green-500/20 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.1)]'
                                    : 'bg-red-500/5 border-red-500/20 text-red-500'}`}>
                                    <DeviceMobile size={32} weight="duotone" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 group/title">
                                        <h3 className="font-black text-xl text-white truncate">{instance.name}</h3>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setEditingInstance(instance); setNewName(instance.name); }}
                                            className="opacity-0 group-hover/title:opacity-100 transition-opacity p-1 hover:text-primary shrink-0"
                                        >
                                            <PencilSimple size={14} />
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 font-black uppercase tracking-widest opacity-60">
                                        ID: {instance.instance_id.slice(0, 8)}...
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                {instance.status !== 'connected' && (
                                    <button
                                        onClick={(e) => handleReconnect(instance.instance_id, e)}
                                        title={t('retry')}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:text-primary hover:bg-primary/10 transition border border-white/5"
                                    >
                                        <ArrowClockwise size={20} weight="bold" />
                                    </button>
                                )}
                                <button
                                    onClick={(e) => handleDelete(instance.instance_id, e)}
                                    title={t('delete')}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition border border-white/5"
                                >
                                    <Trash size={20} weight="bold" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Chat Logging</span>
                                    <p className="text-[9px] text-gray-600 font-medium">Save traffic to database</p>
                                </div>
                                <button
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        try {
                                            await fetchWithAuth(`/instances/${instance.instance_id}/toggle-chat`, {
                                                method: 'PATCH',
                                                body: JSON.stringify({ enabled: !instance.chat_enabled })
                                            });
                                            loadInstances();
                                        } catch (error) {
                                            alert('Toggle operation failed.');
                                        }
                                    }}
                                    className={`w-12 h-6 rounded-full relative transition-colors duration-500 ${instance.chat_enabled ? 'bg-primary shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'bg-white/10 border border-white/5'}`}
                                >
                                    <motion.div
                                        animate={{ x: instance.chat_enabled ? 26 : 4 }}
                                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between border-t border-white/5 pt-6">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Phone Record</span>
                                <span className="text-sm font-mono text-white/80">{instance.phone_number || 'PENDING_LINK'}</span>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                    <div className="flex items-center gap-2">
                                        {instance.status === 'connected' ? (
                                            <WifiHigh size={16} className="text-green-500" weight="bold" />
                                        ) : (
                                            <WifiSlash size={16} className="text-red-500" weight="bold" />
                                        )}
                                        <span className={instance.status === 'connected' ? 'text-green-500' : 'text-red-500'}>
                                            {instance.status}
                                        </span>
                                    </div>
                                    <span className="text-gray-500 font-mono">100% SIGNAL</span>
                                </div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: instance.status === 'connected' ? '100%' : '0%' }}
                                        className={`h-full rounded-full ${instance.status === 'connected' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {instances.length === 0 && (
                    <div className="col-span-full py-32 text-center carbon-card rounded-[3rem] border-dashed border-white/10">
                        <Broadcast size={80} weight="duotone" className="mx-auto mb-6 text-gray-700" />
                        <h3 className="text-2xl font-black mb-2">No Active Nodes</h3>
                        <p className="text-gray-500 font-medium">Provision your first edge node to begin automated messaging.</p>
                    </div>
                )}
            </div>

            {/* QR Modal */}
            <AnimatePresence>
                {showQR && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowQR(false)}
                            className="absolute inset-0 bg-carbon/95 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ scale: 0.9, y: 30, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 30, opacity: 0 }}
                            className="carbon-card rounded-[3rem] p-8 md:p-12 max-w-4xl w-full shadow-3xl relative overflow-hidden border-white/10 max-h-[90vh] overflow-y-auto"
                        >
                            <button
                                onClick={() => setShowQR(false)}
                                className="absolute top-8 right-8 text-gray-500 hover:text-white transition"
                            >
                                <X size={24} weight="bold" />
                            </button>

                            <div className="flex flex-col items-center mb-8 relative z-10">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 mb-4 font-black text-primary">
                                    {connectionMethod === 'qr' ? <QrCode size={28} weight="bold" /> : <DeviceMobile size={28} weight="bold" />}
                                </div>
                                <h2 className="text-2xl font-black text-white mb-1 tracking-tight">Integration Portal</h2>
                                <p className="text-gray-500 font-medium text-xs text-center">Establish a link via QR or pairing code.</p>
                            </div>

                            {/* Method Selection */}
                            <div className="flex bg-white/5 p-1.5 rounded-2xl mb-8 border border-white/5">
                                <button
                                    onClick={() => { setConnectionMethod('qr'); setPairingCode(null); }}
                                    className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition ${connectionMethod === 'qr' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-white/5'}`}
                                >
                                    Traditional QR Sync
                                </button>
                                <button
                                    onClick={() => setConnectionMethod('pairing')}
                                    className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition ${connectionMethod === 'pairing' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-white/5'}`}
                                >
                                    8-Digit Pairing Code
                                </button>
                            </div>

                            {/* Side-by-side layout for QR and instructions */}
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Left side: QR or Pairing */}
                                <div className="relative group flex-1 min-w-0">
                                    {connectionMethod === 'qr' ? (
                                        <div className="w-full max-w-[280px] mx-auto aspect-square bg-white p-4 rounded-[2rem] shadow-2xl flex items-center justify-center relative overflow-hidden border-[8px] border-carbon">
                                            {qrCode ? (
                                                <div className="relative w-full h-full">
                                                    <QRCodeSVG value={qrCode} size={220} className="w-full h-full" bgColor="#ffffff" fgColor="#0d0b1a" />
                                                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                                                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                                                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                                                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg" />
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <Spinner size={40} className="animate-spin text-primary mb-4" weight="bold" />
                                                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest animate-pulse">Awaiting Signal...</p>
                                                </div>
                                            )}
                                            <AnimatePresence>
                                                {qrCode && (
                                                    <motion.div
                                                        animate={{ top: ['5%', '95%', '5%'] }}
                                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                                        className="absolute left-[5%] right-[5%] h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80 blur-[1px] pointer-events-none z-20 shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                                                    />
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        <div className="w-full space-y-4">
                                            {!pairingCode ? (
                                                <div className="space-y-4">
                                                    <div className="relative group">
                                                        <input
                                                            type="text"
                                                            placeholder="Phone Number (e.g. 2012345678)"
                                                            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white font-bold focus:outline-none focus:border-primary transition"
                                                            value={phoneNumber}
                                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={handleRequestPairingCode}
                                                        disabled={pairingLoading || !phoneNumber}
                                                        className="w-full py-4 bg-primary rounded-2xl text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-3"
                                                    >
                                                        {pairingLoading ? <Spinner className="animate-spin" size={20} /> : 'Generate Pairing Code'}
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-6 py-8 card-glass rounded-[2rem] border border-white/5 bg-white/[0.02]">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Your Pairing Code</p>
                                                    <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 px-2">
                                                        {pairingCode.split('').map((char, i) => (
                                                            <div key={i} className="w-8 h-10 md:w-10 md:h-14 bg-white/10 rounded-lg md:rounded-xl flex items-center justify-center text-xl md:text-2xl font-black text-primary border border-white/10 shadow-xl relative">
                                                                {char}
                                                                {i === 3 && (
                                                                    <div className="absolute -right-[0.45rem] top-1/2 -translate-y-1/2 w-1 h-1 bg-gray-500 rounded-full hidden md:block" />
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex flex-col items-center gap-3">
                                                        <p className="text-[9px] text-gray-600 font-medium max-w-[200px] text-center">Type this code on your WhatsApp mobile app.</p>
                                                        <button
                                                            onClick={copyPairingCode}
                                                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${pairingCopied
                                                                    ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                                                                    : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white'
                                                                }`}
                                                        >
                                                            {pairingCopied ? <CheckCircle size={14} weight="bold" /> : <Copy size={14} weight="bold" />}
                                                            {pairingCopied ? 'Copied' : 'Copy Code'}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <div className="absolute -inset-4 bg-primary/20 rounded-[4rem] blur-3xl -z-10 opacity-30 hidden md:block" />
                                </div>

                                {/* Right side: Instructions */}
                                <div className="flex-1 flex flex-col justify-center space-y-3">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">How to Connect</h3>
                                    {connectionMethod === 'qr' ? (
                                        [
                                            { step: 1, text: "Open WhatsApp > Linked Devices" },
                                            { step: 2, text: "Tap 'Link a Device'" },
                                            { step: 3, text: "Point your phone camera at this QR code" }
                                        ].map((step) => (
                                            <div key={step.step} className="flex items-center gap-3 bg-white/[0.03] p-3 rounded-xl border border-white/5 group/step hover:bg-white/[0.05] transition-colors">
                                                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center font-black text-xs text-primary border border-white/5 group-hover/step:border-primary/30 transition-colors shrink-0">
                                                    {step.step}
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover/step:text-gray-300 transition-colors">
                                                    {step.text}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        [
                                            { step: 1, text: "Open WhatsApp > Linked Devices" },
                                            { step: 2, text: "Tap 'Link with phone number instead'" },
                                            { step: 3, text: "Enter the pairing code shown" }
                                        ].map((step) => (
                                            <div key={step.step} className="flex items-center gap-3 bg-white/[0.03] p-3 rounded-xl border border-white/5 group/step hover:bg-white/[0.05] transition-colors">
                                                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center font-black text-xs text-primary border border-white/5 group-hover/step:border-primary/30 transition-colors shrink-0">
                                                    {step.step}
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover/step:text-gray-300 transition-colors">
                                                    {step.text}
                                                </span>
                                            </div>
                                        ))
                                    )}

                                    {!qrCode && connectionMethod === 'qr' && (
                                        <button
                                            onClick={handleCreateInstance}
                                            className="w-full py-3 mt-4 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-white/10 hover:text-white transition-all border border-white/5"
                                        >
                                            Force Re-Provision Signal
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Rename Modal */}
            <AnimatePresence>
                {editingInstance && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="carbon-card rounded-[2.5rem] p-10 max-w-md w-full border-white/10 shadow-3xl"
                        >
                            <h3 className="text-2xl font-black mb-6">Rename Global Node</h3>
                            <form onSubmit={handleRename} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block ml-1">New Identity Label</label>
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={e => setNewName(e.target.value)}
                                        autoFocus
                                        className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:border-primary/50 transition font-bold"
                                        placeholder="e.g. Sales Node 01"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setEditingInstance(null)}
                                        className="flex-1 py-4 text-gray-500 font-bold text-sm uppercase tracking-widest bg-white/5 rounded-2xl hover:bg-white/10 transition"
                                    >
                                        {t('abort')}
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-primary text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition"
                                    >
                                        {t('update')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
