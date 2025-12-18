'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash, QrCode, WifiHigh, WifiSlash, Spinner, DeviceMobile, Broadcast, X, PencilSimple, ArrowClockwise } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchWithAuth, SOCKET_URL } from '@/lib/api';
import { io } from 'socket.io-client';
import { QRCodeSVG } from 'qrcode.react';

export default function InstancesPage() {
    const [instances, setInstances] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showQR, setShowQR] = useState(false);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [socket, setSocket] = useState<any>(null);
    const [newInstanceId, setNewInstanceId] = useState<string | null>(null);
    const [editingInstance, setEditingInstance] = useState<any>(null);
    const [newName, setNewName] = useState('');

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
            socket.on('qr', ({ qr }: { qr: string }) => setQrCode(qr));
            socket.on('connection_update', ({ status }: { status: string }) => {
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
        setShowQR(true);
        try {
            await fetchWithAuth(`/instances/${id}/reconnect`, { method: 'POST' });
            socket.emit('join_instance', id);
        } catch (error) {
            console.error('Reconnect failed', error);
        }
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
                    Provision Node
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

                        <div className="flex items-start justify-between relative z-10 mb-8">
                            <div className="flex items-center gap-5">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500 ${instance.status === 'connected'
                                    ? 'bg-green-500/5 border-green-500/20 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.1)]'
                                    : 'bg-red-500/5 border-red-500/20 text-red-500'}`}>
                                    <DeviceMobile size={32} weight="duotone" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 group/title">
                                        <h3 className="font-black text-xl text-white truncate">{instance.name}</h3>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setEditingInstance(instance); setNewName(instance.name); }}
                                            className="opacity-0 group-hover/title:opacity-100 transition-opacity p-1 hover:text-primary"
                                        >
                                            <PencilSimple size={14} />
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 font-black uppercase tracking-widest opacity-60">
                                        ID: {instance.instance_id.slice(0, 8)}...
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {instance.status !== 'connected' && (
                                    <button
                                        onClick={(e) => handleReconnect(instance.instance_id, e)}
                                        title="Reconnect"
                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:text-primary hover:bg-primary/10 transition border border-white/5"
                                    >
                                        <ArrowClockwise size={20} weight="bold" />
                                    </button>
                                )}
                                <button
                                    onClick={(e) => handleDelete(instance.instance_id, e)}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition border border-white/5"
                                >
                                    <Trash size={20} weight="bold" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center justify-between">
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
                            className="absolute inset-0 bg-[#0d0b1a]/95 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ scale: 0.9, y: 30, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 30, opacity: 0 }}
                            className="carbon-card rounded-[3rem] p-12 max-w-md w-full shadow-3xl relative overflow-hidden border-white/10"
                        >
                            <button
                                onClick={() => setShowQR(false)}
                                className="absolute top-8 right-8 text-gray-500 hover:text-white transition"
                            >
                                <X size={24} weight="bold" />
                            </button>

                            <div className="flex flex-col items-center mb-10 relative z-10">
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 mb-6 font-black text-primary">
                                    <QrCode size={32} weight="bold" />
                                </div>
                                <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Sync Node</h2>
                                <p className="text-gray-500 font-medium text-sm text-center">Establish a low-latency link between your device and the edge network.</p>
                            </div>

                            <div className="relative group mb-10">
                                <div className="w-full aspect-square bg-white p-6 rounded-[3rem] shadow-2xl flex items-center justify-center relative overflow-hidden border-[12px] border-[#0d0b1a]">
                                    {qrCode ? (
                                        <div className="relative w-full h-full">
                                            <QRCodeSVG value={qrCode} size={280} className="w-full h-full" bgColor="#ffffff" fgColor="#0d0b1a" />
                                            {/* Corner Markers */}
                                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <Spinner size={48} className="animate-spin text-primary mb-6" weight="bold" />
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest animate-pulse">Awaiting Signal...</p>
                                        </div>
                                    )}

                                    {/* Laser Scan Effect */}
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
                                <div className="absolute -inset-4 bg-primary/20 rounded-[4rem] blur-3xl -z-10 opacity-50" />
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {[
                                    { step: 1, text: "Open WhatsApp on your mobile device" },
                                    { step: 2, text: "Tap Menu or Settings > Linked Devices" },
                                    { step: 3, text: "Tap Link a Device and point to this screen" }
                                ].map((step) => (
                                    <div key={step.step} className="flex items-center gap-4 bg-white/[0.03] p-4 rounded-2xl border border-white/5 group/step hover:bg-white/[0.05] transition-colors">
                                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center font-black text-xs text-primary border border-white/5 group-hover/step:border-primary/30 transition-colors">
                                            {step.step}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover/step:text-gray-300 transition-colors">
                                            {step.text}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {!qrCode && (
                                <div className="mt-8">
                                    <button
                                        onClick={handleCreateInstance}
                                        className="w-full py-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-white/10 hover:text-white transition-all border border-white/5"
                                    >
                                        Force Re-Provision Signal
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Rename Modal */}
            <AnimatePresence>
                {editingInstance && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#0b0914]/80 backdrop-blur-xl">
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
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-primary text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition"
                                    >
                                        Update
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
