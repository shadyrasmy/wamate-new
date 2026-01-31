'use client';
import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/api';
import { ShoppingCart, Export, MapPin, Package, CheckCircle, Clock, XCircle, Pencil, Trash, X } from '@phosphor-icons/react';
import toast from 'react-hot-toast';

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<any>(null);

    // Edit Modal State
    const [editingOrder, setEditingOrder] = useState<any>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    useEffect(() => {
        loadOrders();
    }, [filter, page]);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const res = await fetchWithAuth(`/orders?status=${filter}&page=${page}&limit=20`);
            setOrders(res.data.orders);
            setPagination(res.data.pagination);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveOrder = async () => {
        if (!editingOrder) return;
        try {
            await fetchWithAuth(`/orders/${editingOrder.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    status: editingOrder.status,
                    total_price: parseFloat(editingOrder.total_price),
                    shipping_details: editingOrder.shipping_details
                })
            });
            setOrders(prev => prev.map(o => o.id === editingOrder.id ? editingOrder : o));
            toast.success('Order updated successfully');
            setIsEditOpen(false);
        } catch (error) {
            toast.error('Update failed');
        }
    };

    const handleDeleteOrder = async (id: string) => {
        if (!confirm('Are you sure you want to delete this order? This cannot be undone.')) return;
        try {
            await fetchWithAuth(`/orders/${id}`, { method: 'DELETE' });
            setOrders(prev => prev.filter(o => o.id !== id));
            toast.success('Order deleted');
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const handleExport = async () => {
        try {
            const token = localStorage.getItem('token');
            // Use the centralized API_URL which handles the env var logic
            const { API_URL } = await import('@/lib/api');
            const res = await fetch(`${API_URL}/orders/export?status=${filter}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `orders-export-${Date.now()}.csv`;
            a.click();
        } catch (error) {
            toast.error('Export failed');
        }
    };

    // Helper to parse items safely
    const renderItems = (itemsRaw: any) => {
        try {
            const items = typeof itemsRaw === 'string' ? JSON.parse(itemsRaw) : itemsRaw;
            if (!Array.isArray(items)) return <span className="text-gray-500">Invalid items data</span>;

            return (
                <div className="flex flex-col gap-2">
                    {items.map((item: any, idx: number) => (
                        <div key={idx} className="bg-white/5 rounded-lg p-2 text-xs border border-white/5">
                            <div className="font-bold text-white mb-0.5">
                                {item.product} <span className="text-green-400">x{item.quantity}</span>
                            </div>
                            <div className="flex gap-2 text-[10px] text-gray-400">
                                {item.color && <span className="px-1.5 py-0.5 bg-white/10 rounded">{item.color}</span>}
                                {item.size && <span className="px-1.5 py-0.5 bg-white/10 rounded">{item.size}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            );
        } catch (e) {
            return <span className="text-red-400 text-xs">Error parsing items</span>;
        }
    };

    const statusConfig: any = {
        'Pending': { color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20', icon: Clock },
        'Processing': { color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', icon: Package },
        'Shipped': { color: 'text-purple-500 bg-purple-500/10 border-purple-500/20', icon: MapPin },
        'Delivered': { color: 'text-green-500 bg-green-500/10 border-green-500/20', icon: CheckCircle },
        'Cancelled': { color: 'text-red-500 bg-red-500/10 border-red-500/20', icon: XCircle },
    };

    return (
        <div className="p-4 lg:p-8 space-y-6 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white flex items-center gap-3">
                        <ShoppingCart size={32} className="text-green-500" weight="duotone" />
                        Order Management
                    </h1>
                    <p className="text-gray-400 mt-1">Fulfill orders and track revenue.</p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-bold transition"
                >
                    <Export size={20} />
                    Export CSV
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                    <button
                        key={status}
                        onClick={() => { setFilter(status); setPage(1); }}
                        className={`px-4 py-2 rounded-xl text-sm font-bold border transition whitespace-nowrap ${filter === status
                            ? 'bg-green-600 text-white border-green-600'
                            : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="glass-card rounded-[2rem] border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="p-6 text-xs font-black text-gray-500 uppercase tracking-widest">Order ID / Customer</th>
                                <th className="p-6 text-xs font-black text-gray-500 uppercase tracking-widest">Items</th>
                                <th className="p-6 text-xs font-black text-gray-500 uppercase tracking-widest">Details</th>
                                <th className="p-6 text-xs font-black text-gray-500 uppercase tracking-widest text-right">Status & Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan={4} className="p-10 text-center text-gray-500 animate-pulse">Scanning orders...</td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan={4} className="p-10 text-center text-gray-500">No orders found.</td></tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-white/[0.02] transition">
                                        <td className="p-6 align-top">
                                            <p className="text-gray-500 font-mono text-[10px] mb-1">#{order.id.slice(0, 8)}</p>
                                            <p className="text-white font-bold">{order.contact?.name || 'Unknown'}</p>
                                            <p className="text-xs text-green-400 font-mono mt-1">{order.contact?.phone}</p>
                                            <p className="text-[10px] text-gray-600 mt-2">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="p-6 align-top max-w-xs">
                                            {renderItems(order.items)}
                                        </td>
                                        <td className="p-6 align-top">
                                            <div className="space-y-1">
                                                <p className="text-white font-black text-lg mb-2">
                                                    {order.total_price?.toLocaleString()}
                                                    <span className="text-xs font-bold text-gray-500 ml-1">{order.currency}</span>
                                                </p>
                                                {order.shipping_details && (
                                                    <div className="text-xs text-gray-400 space-y-1">
                                                        {order.shipping_details.governorate && (
                                                            <p><span className="text-gray-600">Gov:</span> {order.shipping_details.governorate}</p>
                                                        )}
                                                        {order.shipping_details.city && (
                                                            <p><span className="text-gray-600">City:</span> {order.shipping_details.city}</p>
                                                        )}
                                                        {order.shipping_details.address && (
                                                            <p><span className="text-gray-600">Addr:</span> {order.shipping_details.address}</p>
                                                        )}
                                                        {order.shipping_details.phone2 && (
                                                            <p><span className="text-gray-600">Alt Ph:</span> {order.shipping_details.phone2}</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-6 align-top text-right">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border mb-3 ${statusConfig[order.status]?.color || 'text-gray-400 border-gray-700'}`}>
                                                {order.status}
                                            </span>

                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => { setEditingOrder({ ...order }); setIsEditOpen(true); }}
                                                    className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition"
                                                    title="Edit Order"
                                                >
                                                    <Pencil weight="bold" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                                                    title="Delete Order"
                                                >
                                                    <Trash weight="bold" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                    <div className="p-6 border-t border-white/5 flex justify-center gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-4 py-2 rounded-xl bg-white/5 disabled:opacity-50 text-white font-bold text-sm"
                        >
                            Prev
                        </button>
                        <span className="px-4 py-2 text-gray-400 text-sm flex items-center">
                            Page {page} of {pagination.pages}
                        </span>
                        <button
                            disabled={page === pagination.pages}
                            onClick={() => setPage(p => p + 1)}
                            className="px-4 py-2 rounded-xl bg-white/5 disabled:opacity-50 text-white font-bold text-sm"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* EDIT MODAL */}
            {isEditOpen && editingOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
                        <button
                            onClick={() => setIsEditOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X size={20} weight="bold" />
                        </button>

                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Pencil weight="duotone" className="text-blue-500" />
                            Edit Order #{editingOrder.id.slice(0, 8)}
                        </h2>

                        <div className="space-y-4">
                            {/* Status */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Status</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {Object.keys(statusConfig).map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setEditingOrder({ ...editingOrder, status: s })}
                                            className={`px-3 py-2 rounded-lg text-xs font-bold border transition ${editingOrder.status === s
                                                ? 'bg-blue-600 text-white border-blue-500'
                                                : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Total Price ({editingOrder.currency})</label>
                                <input
                                    type="number"
                                    value={editingOrder.total_price}
                                    onChange={(e) => setEditingOrder({ ...editingOrder, total_price: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                                />
                            </div>

                            {/* Shipping Details */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Shipping Details</label>
                                <div className="space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            placeholder="Governorate"
                                            value={editingOrder.shipping_details?.governorate || ''}
                                            onChange={(e) => setEditingOrder({
                                                ...editingOrder,
                                                shipping_details: { ...editingOrder.shipping_details, governorate: e.target.value }
                                            })}
                                            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                        />
                                        <input
                                            placeholder="City"
                                            value={editingOrder.shipping_details?.city || ''}
                                            onChange={(e) => setEditingOrder({
                                                ...editingOrder,
                                                shipping_details: { ...editingOrder.shipping_details, city: e.target.value }
                                            })}
                                            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <input
                                        placeholder="Full Address"
                                        value={editingOrder.shipping_details?.address || ''}
                                        onChange={(e) => setEditingOrder({
                                            ...editingOrder,
                                            shipping_details: { ...editingOrder.shipping_details, address: e.target.value }
                                        })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                    />
                                    <input
                                        placeholder="Alternative Phone"
                                        value={editingOrder.shipping_details?.phone2 || ''}
                                        onChange={(e) => setEditingOrder({
                                            ...editingOrder,
                                            shipping_details: { ...editingOrder.shipping_details, phone2: e.target.value }
                                        })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button
                                onClick={() => setIsEditOpen(false)}
                                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveOrder}
                                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition shadow-lg shadow-blue-500/20"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
