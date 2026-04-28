'use client';
import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/api';
import { ShoppingCart, Export, MapPin, Package, CheckCircle, Clock, XCircle, Pencil, Trash, X } from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import { useUI } from '@/context/UIContext';

export default function OrdersPage() {
    const { t } = useUI();
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
            toast.error(t('dashboard.orders.load_error'));
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
            toast.success(t('dashboard.orders.update_success'));
            setIsEditOpen(false);
        } catch (error) {
            toast.error(t('dashboard.orders.update_error'));
        }
    };

    const handleDeleteOrder = async (id: string) => {
        if (!confirm(t('dashboard.orders.delete_order') + '?')) return;
        try {
            await fetchWithAuth(`/orders/${id}`, { method: 'DELETE' });
            setOrders(prev => prev.filter(o => o.id !== id));
            toast.success(t('dashboard.orders.delete_success'));
        } catch (error) {
            toast.error(t('dashboard.orders.delete_error'));
        }
    };

    const handleExport = async () => {
        try {
            const token = localStorage.getItem('token');
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
            toast.error(t('dashboard.orders.export_error'));
        }
    };

    const renderItems = (itemsRaw: any) => {
        try {
            const items = typeof itemsRaw === 'string' ? JSON.parse(itemsRaw) : itemsRaw;
            if (!Array.isArray(items)) return <span className="text-muted">{t('dashboard.orders.invalid_items')}</span>;

            return (
                <div className="flex flex-col gap-2">
                    {items.map((item: any, idx: number) => (
                        <div key={idx} className="bg-control rounded-lg p-2 text-xs border border-border">
                            <div className="font-bold text-foreground mb-0.5">
                                {item.product} <span className="text-green-400">x{item.quantity}</span>
                            </div>
                            <div className="flex gap-2 text-[10px] text-muted">
                                {item.color && <span className="px-1.5 py-0.5 bg-surface-soft rounded">{item.color}</span>}
                                {item.size && <span className="px-1.5 py-0.5 bg-surface-soft rounded">{item.size}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            );
        } catch (e) {
            return <span className="text-red-400 text-xs">{t('dashboard.orders.parse_error')}</span>;
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
                    <h1 className="text-2xl font-black text-foreground flex items-center gap-3">
                        <ShoppingCart size={32} className="text-green-500" weight="duotone" />
                        {t('dashboard.orders.title')}
                    </h1>
                    <p className="text-muted mt-1">{t('dashboard.orders.subtitle')}</p>
                </div>
                <button
                    onClick={handleExport}
                    className="theme-button-secondary flex items-center gap-2 px-6 py-3 rounded-2xl font-bold"
                >
                    <Export size={20} />
                    {t('dashboard.orders.export_csv')}
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
                            : 'bg-control text-muted border-border hover:bg-control-hover hover:text-foreground'
                            }`}
                    >
                        {status === 'All' ? t('admin.invoices.status_all') : t(`dashboard.orders.status_${status.toLowerCase()}`, { defaultValue: status })}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="glass-card rounded-[2rem] border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border bg-surface-soft">
                                <th className="p-6 text-xs font-black text-muted uppercase tracking-widest">{t('dashboard.orders.table_id_customer')}</th>
                                <th className="p-6 text-xs font-black text-muted uppercase tracking-widest">{t('dashboard.orders.table_items')}</th>
                                <th className="p-6 text-xs font-black text-muted uppercase tracking-widest">{t('dashboard.orders.table_details')}</th>
                                <th className="p-6 text-xs font-black text-muted uppercase tracking-widest text-right">{t('dashboard.orders.table_status_actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr><td colSpan={4} className="p-10 text-center text-muted animate-pulse">{t('dashboard.orders.scanning')}</td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan={4} className="p-10 text-center text-muted">{t('dashboard.orders.no_orders')}</td></tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-surface-soft transition">
                                        <td className="p-6 align-top">
                                            <p className="text-muted font-mono text-[10px] mb-1">#{order.id.slice(0, 8)}</p>
                                            <p className="text-foreground font-bold">{order.contact?.name || t('dashboard.orders.unknown_customer')}</p>
                                            <p className="text-xs text-green-400 font-mono mt-1">{order.contact?.phone}</p>
                                            <p className="text-[10px] text-muted mt-2">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="p-6 align-top max-w-xs">
                                            {renderItems(order.items)}
                                        </td>
                                        <td className="p-6 align-top">
                                            <div className="space-y-1">
                                                <p className="text-foreground font-black text-lg mb-2">
                                                    {order.total_price?.toLocaleString()}
                                                    <span className="text-xs font-bold text-muted ml-1">{order.currency}</span>
                                                </p>
                                                {order.shipping_details && (
                                                    <div className="text-xs text-muted space-y-1">
                                                        {order.shipping_details.governorate && (
                                                            <p><span className="text-muted">{t('dashboard.orders.gov_label')}</span> {order.shipping_details.governorate}</p>
                                                        )}
                                                        {order.shipping_details.city && (
                                                            <p><span className="text-muted">{t('dashboard.orders.city_label')}</span> {order.shipping_details.city}</p>
                                                        )}
                                                        {order.shipping_details.address && (
                                                            <p><span className="text-muted">{t('dashboard.orders.addr_label')}</span> {order.shipping_details.address}</p>
                                                        )}
                                                        {order.shipping_details.phone2 && (
                                                            <p><span className="text-muted">{t('dashboard.orders.alt_ph_label')}</span> {order.shipping_details.phone2}</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-6 align-top text-right">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border mb-3 ${statusConfig[order.status]?.color || 'text-muted border-border'}`}>
                                                {t(`dashboard.orders.status_${order.status.toLowerCase()}`, { defaultValue: order.status })}
                                            </span>

                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => { setEditingOrder({ ...order }); setIsEditOpen(true); }}
                                                    className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition"
                                                    title={t('dashboard.orders.edit_order')}
                                                >
                                                    <Pencil weight="bold" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                                                    title={t('dashboard.orders.delete_order')}
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
                    <div className="p-6 border-t border-border flex justify-center gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="theme-button-secondary px-4 py-2 rounded-xl disabled:opacity-50 font-bold text-sm"
                        >
                            {t('dashboard.orders.prev')}
                        </button>
                        <span className="px-4 py-2 text-muted text-sm flex items-center">
                            {t('dashboard.orders.page_x_of_y', { page: page, pages: pagination.pages })}
                        </span>
                        <button
                            disabled={page === pagination.pages}
                            onClick={() => setPage(p => p + 1)}
                            className="theme-button-secondary px-4 py-2 rounded-xl disabled:opacity-50 font-bold text-sm"
                        >
                            {t('dashboard.orders.next')}
                        </button>
                    </div>
                )}
            </div>

            {/* EDIT MODAL */}
            {isEditOpen && editingOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="carbon-card border border-border rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
                        <button
                            onClick={() => setIsEditOpen(false)}
                            className="absolute top-4 right-4 text-muted hover:text-foreground"
                        >
                            <X size={20} weight="bold" />
                        </button>

                        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                            <Pencil weight="duotone" className="text-blue-500" />
                            {t('dashboard.orders.edit_title', { id: editingOrder.id.slice(0, 8) })}
                        </h2>

                        <div className="space-y-4">
                            {/* Status */}
                            <div>
                                <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-2">{t('dashboard.orders.status_label')}</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {Object.keys(statusConfig).map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setEditingOrder({ ...editingOrder, status: s })}
                                            className={`px-3 py-2 rounded-lg text-xs font-bold border transition ${editingOrder.status === s
                                                ? 'bg-blue-600 text-white border-blue-500'
                                                : 'bg-control text-muted border-border hover:bg-control-hover hover:text-foreground'
                                                }`}
                                        >
                                            {t(`dashboard.orders.status_${s.toLowerCase()}`, { defaultValue: s })}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price */}
                            <div>
                                <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-2">{t('dashboard.orders.price_label', { currency: editingOrder.currency })}</label>
                                <input
                                    type="number"
                                    value={editingOrder.total_price}
                                    onChange={(e) => setEditingOrder({ ...editingOrder, total_price: e.target.value })}
                                    className="theme-input-solid w-full rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition"
                                />
                            </div>

                            {/* Shipping Details */}
                            <div>
                                <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-2">{t('dashboard.orders.shipping_label')}</label>
                                <div className="space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            placeholder={t('dashboard.orders.gov_placeholder')}
                                            value={editingOrder.shipping_details?.governorate || ''}
                                            onChange={(e) => setEditingOrder({
                                                ...editingOrder,
                                                shipping_details: { ...editingOrder.shipping_details, governorate: e.target.value }
                                            })}
                                            className="theme-input-solid rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                        />
                                        <input
                                            placeholder={t('dashboard.orders.city_placeholder')}
                                            value={editingOrder.shipping_details?.city || ''}
                                            onChange={(e) => setEditingOrder({
                                                ...editingOrder,
                                                shipping_details: { ...editingOrder.shipping_details, city: e.target.value }
                                            })}
                                            className="theme-input-solid rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <input
                                        placeholder={t('dashboard.orders.addr_placeholder')}
                                        value={editingOrder.shipping_details?.address || ''}
                                        onChange={(e) => setEditingOrder({
                                            ...editingOrder,
                                            shipping_details: { ...editingOrder.shipping_details, address: e.target.value }
                                        })}
                                        className="theme-input-solid w-full rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                    />
                                    <input
                                        placeholder={t('dashboard.orders.alt_ph_placeholder')}
                                        value={editingOrder.shipping_details?.phone2 || ''}
                                        onChange={(e) => setEditingOrder({
                                            ...editingOrder,
                                            shipping_details: { ...editingOrder.shipping_details, phone2: e.target.value }
                                        })}
                                        className="theme-input-solid w-full rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button
                                onClick={() => setIsEditOpen(false)}
                                className="theme-button-secondary flex-1 py-3 font-bold rounded-xl"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                onClick={handleSaveOrder}
                                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition shadow-lg shadow-blue-500/20"
                            >
                                {t('admin.settings.save_changes')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
