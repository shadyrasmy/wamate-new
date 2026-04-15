import { useState, useEffect, useCallback } from "react";
import { OrderRepository } from "@/lib/OrderRepository";
import { supabase } from "@/lib/supabase";
import type { Order, CartItem, ProductVariant } from "@/lib/types/order";
import {
    ArrowLeft,
    ArrowsClockwise,
    Package,
    Clock,
    CreditCard,
    Truck,
    ChatCircleText,
    Note,
    Tag,
    ShoppingCart,
    CaretRight,
    MapPin,
    Phone,
    User,
    Pencil,
    Plus,
    MagnifyingGlass,
    X,
    FloppyDisk,
    PaperPlaneRight,
    Spinner,
    Warning
} from "@phosphor-icons/react";

// Native Tailwind replacements for ShadCN components
const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`glass-card rounded-2xl border border-border backdrop-blur-md shadow-xl text-foreground ${className}`}>
        {children}
    </div>
);

const CarbonCard = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
    <div
        onClick={onClick}
        className={`rounded-xl border border-border bg-control p-3 hover:bg-control-hover transition-colors text-foreground ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
        {children}
    </div>
);

const Badge = ({ children, color = "primary", className = "" }: { children: React.ReactNode, color?: string, className?: string }) => {
    let colorStyle = "bg-primary/20 text-primary border-primary/30";
    if (color === "green") colorStyle = "bg-green-500/20 text-green-400 border-green-500/30";
    if (color === "red") colorStyle = "bg-red-500/20 text-red-400 border-red-500/30";
    if (color === "yellow") colorStyle = "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    if (color === "gray") colorStyle = "bg-control text-muted border-control-border";

    if (color.startsWith("#")) {
        return (
            <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${className}`}
                style={{ backgroundColor: `${color}20`, color: color, borderColor: `${color}40` }}
            >
                {children}
            </span>
        );
    }

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colorStyle} ${className}`}>
            {children}
        </span>
    );
};

const Button = ({
    children, onClick, variant = "primary", size = "md", disabled = false, className = "", type = "button"
}: any) => {
    const baseStyle = "inline-flex items-center justify-center rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed";
    const sizeStyle = size === "sm" ? "px-3 py-1.5 text-xs" : size === "icon" ? "p-2" : "px-4 py-2 text-sm";

    let variantStyle = "bg-gradient-to-r from-primary to-primary-dark text-white shadow-primary/20 hover:shadow-primary/40 shadow-lg";
    if (variant === "outline") variantStyle = "border border-control-border bg-transparent text-foreground hover:bg-control";
    if (variant === "ghost") variantStyle = "bg-transparent text-muted hover:text-foreground hover:bg-control";
    if (variant === "danger") variantStyle = "bg-red-500/20 text-red-400 hover:bg-red-500/30";

    return (
        <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${sizeStyle} ${variantStyle} ${className}`}>
            {children}
        </button>
    );
};

const Input = ({ value, onChange, placeholder, type = "text", className = "", ...props }: any) => (
    <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-input border border-input-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all ${className}`}
        {...props}
    />
);

const Label = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <label className={`text-[11px] font-black uppercase tracking-widest text-muted mb-1 block ${className}`}>
        {children}
    </label>
);

const Select = ({ value, onChange, options, placeholder = "Select...", disabled = false, className = "" }: any) => {
    return (
        <div className={`relative ${className}`}>
            <select
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full bg-input border border-input-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 appearance-none disabled:opacity-50"
            >
                <option value="" disabled className="bg-surface-dark text-muted">{placeholder}</option>
                {options.map((opt: any) => (
                    <option key={opt.value} value={opt.value} className="bg-surface-dark text-foreground">
                        {opt.label}
                    </option>
                ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                <CaretRight size={14} weight="bold" className="rotate-90" />
            </div>
        </div>
    );
};

// ... Mock statuses for now, as they used to come from API metadata
const DEFAULT_STATUSES = [
    { value: "new", label: "New", color: "#3b82f6" },
    { value: "confirmed", label: "Confirmed", color: "#10b981" },
    { value: "processing", label: "Processing", color: "#8b5cf6" },
    { value: "sent to delivery", label: "Sent to Delivery", color: "#f59e0b" },
    { value: "delivered", label: "Delivered", color: "#059669" },
    { value: "cancelled", label: "Cancelled", color: "#ef4444" },
    { value: "returned", label: "Returned", color: "#991b1b" }
];

const DELIVERY_PROVIDERS = [
    { value: "bosta", label: "Bosta" },
    { value: "turbo", label: "Turbo Delivery" },
    { value: "qpexpress", label: "QP Express" },
];

export function OrderPanel({ contactPhone, contactName }: { contactPhone: string; contactName: string }) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Detail view state
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [noteText, setNoteText] = useState("");
    const [commentText, setCommentText] = useState("");

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await OrderRepository.fetchOrdersByPhone(contactPhone);
            setOrders(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch orders");
        } finally {
            setIsLoading(false);
        }
    }, [contactPhone]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const formatCurrency = (amount?: number) => {
        if (amount == null) return "—";
        return `${amount.toLocaleString()} EGP`;
    };

    const getPaymentBadgeColor = (status?: string) => {
        if (status === 'paid') return 'green';
        if (status === 'deposit') return 'yellow';
        return 'red'; // unpaid
    };

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        setActionLoading(`status-${orderId}`);
        try {
            await OrderRepository.updateOrderStatus(orderId, newStatus);
            await OrderRepository.updateCustomStatus(orderId, newStatus);

            // Optimistic update
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus, custom_status: newStatus } : o));
        } catch (err) {
            console.error("Failed to update status:", err);
            await fetchOrders(); // Revert
        } finally {
            setActionLoading(null);
        }
    };

    const handleAddNote = async (orderId: string) => {
        if (!noteText.trim()) return;
        setActionLoading(`note-${orderId}`);
        try {
            await OrderRepository.updateNotes(orderId, noteText.trim());
            setNoteText("");
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, notes: noteText.trim() } : o));
        } catch (err) {
            console.error("Failed to add note:", err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleAddComment = async (orderId: string) => {
        if (!commentText.trim()) return;
        setActionLoading(`comment-${orderId}`);
        try {
            await OrderRepository.updateInternalNotes(orderId, commentText.trim());
            setCommentText("");
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, internal_notes: commentText.trim() } : o));
        } catch (err) {
            console.error("Failed to add comment:", err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeliveryChange = async (orderId: string, newStatus: string) => {
        setActionLoading(`delivery-${orderId}`);
        try {
            await OrderRepository.updateDeliveryStatus(orderId, newStatus);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, delivery_status: newStatus } : o));
        } catch (err) {
            console.error("Failed to update delivery:", err);
            await fetchOrders();
        } finally {
            setActionLoading(null);
        }
    };

    const handleSendToDelivery = async (orderId: string, provider: string) => {
        setActionLoading(`send-delivery-${orderId}`);
        try {
            const order = orders.find(o => o.id === orderId);
            if (!order) throw new Error("Order not found");

            const finalTotal = order.total_cost || 0;
            let amountToCollect = finalTotal;
            if (order.payment_status === "paid") {
                amountToCollect = 0;
            } else if (order.payment_status === "deposit") {
                amountToCollect = Math.max(0, finalTotal - (order.deposit_amount || 0));
            }

            const orderData = {
                full_name: order.full_name,
                phone: order.phone,
                government: order.government,
                address: order.address,
                notes: order.notes || "",
                cart_items: order.cart_items,
                total_cost: finalTotal,
                amount_to_collect: amountToCollect,
            };

            const body: any = {
                order_id: order.id,
                store_id: order.store_id,
                order_data: orderData,
                shipping_cost: order.shipping_cost || 0,
                amount_to_collect: amountToCollect,
            };

            // Pass optional Bosta location fields if they exist
            if (provider === "bosta") {
                const o: any = order;
                if (o.bosta_city_id) body.bosta_city_id = o.bosta_city_id;
                if (o.bosta_city_name) body.bosta_city_name = o.bosta_city_name;
                if (o.bosta_zone_id) body.bosta_zone_id = o.bosta_zone_id;
                if (o.bosta_zone_name) body.bosta_zone_name = o.bosta_zone_name;
                if (o.bosta_district_id) body.bosta_district_id = o.bosta_district_id;
                if (o.bosta_district_name) body.bosta_district_name = o.bosta_district_name;
            }

            // Pass optional Turbo fields
            if (provider === "turbo") {
                const o: any = order;
                if (o.area) body.area = o.area;
                if (o.government_id) body.government_id = o.government_id;
            }

            let functionName = `${provider}-send-order`;
            if (provider === "qpexpress") functionName = "qp-send-order";

            const { data: result, error: fnError } = await supabase.functions.invoke(functionName, {
                body,
            });

            if (fnError) throw new Error(fnError.message || "Failed to invoke delivery function");
            if (!result.success) throw new Error(result.error?.message || result.error || "Delivery function returned error");

            const trackingNumber = result.tracking_number || result.trackingNumber;
            const deliveryId = result.delivery_id;

            // Manual updates directly to DB since we bypassed order-api
            await OrderRepository.updateOrderStatus(orderId, "sent to delivery");
            await OrderRepository.updateDeliveryStatus(orderId, "sent");

            const trackingMsg = trackingNumber ? `\nTracking: ${trackingNumber}\nID: ${deliveryId || 'N/A'}` : '';
            await OrderRepository.updateInternalNotes(
                orderId,
                `${order.internal_notes ? order.internal_notes + '\n\n' : ''}Sent to ${provider.toUpperCase()} via Direct API${trackingMsg}`
            );

            // Optimistic update
            setOrders(prev => prev.map(o => o.id === orderId ? {
                ...o,
                custom_status: "sent to delivery",
                delivery_status: "sent",
            } : o));

            alert(`✅ Sent to ${provider.toUpperCase()}!${trackingNumber ? `\nTracking: ${trackingNumber}` : ""}`);
            await fetchOrders();
        } catch (err: any) {
            console.error("Failed to send to delivery:", err);
            alert(`❌ Failed to send to ${provider}: ${err.message || "Unknown error"}`);
        } finally {
            setActionLoading(null);
        }
    };

    // --- RENDER ORDER LIST ---
    if (!selectedOrderId) {
        return (
            <GlassCard className="flex flex-col h-full w-full max-w-sm rounded-none sm:rounded-2xl sm:my-4 sm:mr-4 border-r-0 sm:border-r border-border overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border bg-surface-inset">
                    <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm flex items-center gap-2 text-foreground">
                            <ShoppingCart size={18} weight="fill" className="text-primary" />
                            Orders
                        </h4>
                        <p className="text-[11px] text-muted truncate mt-0.5">{contactName || contactPhone}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={fetchOrders} disabled={isLoading}>
                        <ArrowsClockwise size={16} weight="bold" className={isLoading ? "animate-spin" : ""} />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-28 bg-control rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                            <Warning size={40} weight="duotone" className="text-red-500 mb-3 opacity-80" />
                            <p className="text-sm font-bold text-red-400">Failed to load CRM</p>
                            <p className="text-xs text-muted mt-1">{error}</p>
                            <Button variant="outline" size="sm" className="mt-4" onClick={fetchOrders}>Retry</Button>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center h-full opacity-60">
                            <Package size={48} weight="duotone" className="text-muted mb-4" />
                            <p className="text-sm font-bold text-muted-soft">No History Found</p>
                            <p className="text-xs text-muted mt-1">No orders match this phone number in the database.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {orders.map(order => (
                                <CarbonCard key={order.id} onClick={() => setSelectedOrderId(order.id)} className="space-y-3 relative group">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="min-w-0">
                                            <span className="font-bold text-sm text-foreground truncate block">
                                                {order.full_name || "Unknown Customer"}
                                            </span>
                                            <span className="text-[10px] text-muted uppercase font-black tracking-widest mt-0.5 block">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <CaretRight size={16} weight="bold" className="text-muted group-hover:text-primary transition-colors shrink-0" />
                                    </div>

                                    {order.cart_items && order.cart_items.length > 0 && (
                                        <p className="text-xs text-muted truncate">
                                            {order.cart_items.map(i => i.product ? (i.product as any).name : "Item").join(", ")}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-black text-primary">{formatCurrency(order.total_cost)}</span>
                                            <Badge color={getPaymentBadgeColor(order.payment_status)}>
                                                {order.payment_status || "unpaid"}
                                            </Badge>
                                        </div>

                                        {/* Status Picker - Stop event propagation to not open details */}
                                        <div onClick={e => e.stopPropagation()} className="w-[110px]">
                                            <Select
                                                value={order.custom_status || order.status}
                                                onChange={(val: string) => handleStatusChange(order.id, val)}
                                                options={DEFAULT_STATUSES}
                                                disabled={actionLoading === `status-${order.id}`}
                                            />
                                        </div>
                                    </div>
                                </CarbonCard>
                            ))}
                        </div>
                    )}
                </div>
            </GlassCard>
        );
    }

    // --- RENDER ORDER DETAILS ---
    const order = orders.find(o => o.id === selectedOrderId);
    if (!order) return null;

    return (
        <GlassCard className="flex flex-col h-full w-full max-w-sm rounded-none sm:rounded-2xl sm:my-4 sm:mr-4 border-r-0 sm:border-r border-border overflow-hidden relative">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-border bg-surface-inset shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2 bg-control" onClick={() => setSelectedOrderId(null)}>
                    <ArrowLeft size={16} weight="bold" />
                </Button>
                <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-sm text-foreground truncate">Order Details</h4>
                    <p className="text-[11px] text-muted font-medium truncate uppercase tracking-widest mt-0.5">
                        {order.full_name || contactName}
                    </p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-primary/10 text-primary hover:bg-primary hover:text-white" onClick={() => {/* TODO Edit Mode */ }}>
                    <Pencil size={16} weight="bold" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">

                {/* Customer Info */}
                <CarbonCard className="space-y-3">
                    <Label className="flex items-center gap-1.5"><User size={12} weight="bold" /> Customer</Label>
                    <div className="space-y-2">
                        <div className="flex items-start gap-2 text-sm text-foreground">
                            <User size={16} weight="duotone" className="text-muted shrink-0 mt-0.5" />
                            <span className="font-medium">{order.full_name || "—"}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-foreground">
                            <Phone size={16} weight="duotone" className="text-muted shrink-0 mt-0.5" />
                            <span className="font-medium">{order.phone || "—"}</span>
                        </div>
                        {(order.address || order.government) && (
                            <div className="flex items-start gap-2 text-sm text-foreground">
                                <MapPin size={16} weight="duotone" className="text-muted shrink-0 mt-0.5" />
                                <span className="font-medium text-muted-soft leading-snug">
                                    {order.address} {order.government && <span className="text-muted">({order.government})</span>}
                                </span>
                            </div>
                        )}
                    </div>
                </CarbonCard>

                {/* Financials */}
                <CarbonCard className="space-y-3">
                    <Label className="flex items-center gap-1.5"><CreditCard size={12} weight="bold" /> Financials</Label>
                    <div className="grid grid-cols-2 gap-y-2 text-sm border-b border-border pb-3 mb-3">
                        <div className="text-muted">Subtotal:</div>
                        <div className="text-right text-foreground font-medium">{formatCurrency(order.cost)}</div>
                        <div className="text-muted">Shipping:</div>
                        <div className="text-right text-foreground font-medium">{formatCurrency(order.shipping_cost)}</div>
                        <div className="text-muted font-bold mt-1">Total:</div>
                        <div className="text-right text-primary font-black text-base mt-1">{formatCurrency(order.total_cost)}</div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted font-bold uppercase tracking-wider">Payment Status</span>
                        <Badge color={getPaymentBadgeColor(order.payment_status)}>{order.payment_status || "unpaid"}</Badge>
                    </div>
                </CarbonCard>

                {/* Cart Items */}
                {order.cart_items && order.cart_items.length > 0 && (
                    <CarbonCard className="space-y-3">
                        <Label className="flex items-center gap-1.5"><Package size={12} weight="bold" /> Items ({order.cart_items.length})</Label>
                        <div className="space-y-3">
                            {order.cart_items.map((item, idx) => (
                                <div key={item.id || idx} className="flex justify-between items-start pt-3 border-t border-border first:border-t-0 first:pt-0">
                                    <div className="min-w-0 pr-4">
                                        <p className="font-bold text-sm text-foreground leading-tight">
                                            {item.product ? (item.product as any).name : `Product ${idx + 1}`}
                                        </p>
                                        <p className="text-[11px] text-muted mt-1 uppercase tracking-widest font-bold">
                                            {formatCurrency(item.price)} × {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="font-black text-sm text-muted-soft">{formatCurrency(item.price * item.quantity)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CarbonCard>
                )}

                {/* Notes */}
                {(order.notes || order.internal_notes) && (
                    <CarbonCard className="space-y-3">
                        <Label className="flex items-center gap-1.5"><Note size={12} weight="bold" /> Notes</Label>
                        {order.notes && (
                            <div className="bg-control rounded-lg p-2 text-sm text-muted-soft">
                                <span className="text-[10px] text-muted font-bold uppercase tracking-widest block mb-1">Customer Notes</span>
                                {order.notes}
                            </div>
                        )}
                        {order.internal_notes && (
                            <div className="bg-primary/10 border border-primary/20 rounded-lg p-2 text-sm text-primary-light">
                                <span className="text-[10px] text-primary/60 font-bold uppercase tracking-widest block mb-1">Internal Notes</span>
                                {order.internal_notes}
                            </div>
                        )}
                    </CarbonCard>
                )}

                {/* Actions & Notes Placeholder */}
                <CarbonCard className="space-y-4">
                    <Label>Actions</Label>
                    <div className="space-y-3">
                        {/* Status Change */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <span className="text-xs text-muted">Order Status</span>
                                <Select
                                    value={order.custom_status || order.status}
                                    onChange={(val: string) => handleStatusChange(order.id, val)}
                                    options={DEFAULT_STATUSES}
                                    disabled={actionLoading === `status-${order.id}`}
                                />
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-muted">Delivery Status</span>
                                <Select
                                    value={order.delivery_status || ""}
                                    onChange={(val: string) => handleDeliveryChange(order.id, val)}
                                    options={[
                                        { value: "pending", label: "Pending" },
                                        { value: "shipped", label: "Shipped" },
                                        { value: "delivered", label: "Delivered" },
                                        { value: "returned", label: "Returned" },
                                    ]}
                                    disabled={actionLoading === `delivery-${order.id}`}
                                    placeholder="Set delivery..."
                                />
                            </div>
                        </div>

                        {/* Send to Delivery */}
                        <div className="space-y-1 pt-2 border-t border-border">
                            <span className="text-xs text-muted flex items-center gap-1"><PaperPlaneRight size={14} /> Send to Delivery</span>
                            <div className="flex gap-2">
                                <Select
                                    value=""
                                    onChange={(val: string) => handleSendToDelivery(order.id, val)}
                                    options={DELIVERY_PROVIDERS}
                                    disabled={!!actionLoading}
                                    placeholder="Choose provider..."
                                    className="flex-1"
                                />
                                {actionLoading?.startsWith('send-delivery') && (
                                    <div className="h-10 w-10 flex items-center justify-center">
                                        <Spinner size={20} className="animate-spin text-primary" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Add Note */}
                        <div className="space-y-1">
                            <span className="text-xs text-muted">Add Customer Note</span>
                            <div className="flex gap-2">
                                <Input
                                    value={noteText}
                                    onChange={(e: any) => setNoteText(e.target.value)}
                                    placeholder="Type note..."
                                    onKeyDown={(e: any) => e.key === "Enter" && handleAddNote(order.id)}
                                />
                                <Button size="sm" onClick={() => handleAddNote(order.id)} disabled={!noteText.trim() || !!actionLoading}>
                                    Save
                                </Button>
                            </div>
                        </div>

                        {/* Add Internal Comment */}
                        <div className="space-y-1">
                            <span className="text-xs text-muted">Add Internal Comment</span>
                            <div className="flex gap-2">
                                <Input
                                    value={commentText}
                                    onChange={(e: any) => setCommentText(e.target.value)}
                                    placeholder="Internal comment..."
                                    onKeyDown={(e: any) => e.key === "Enter" && handleAddComment(order.id)}
                                />
                                <Button size="sm" variant="outline" onClick={() => handleAddComment(order.id)} disabled={!commentText.trim() || !!actionLoading}>
                                    Save
                                </Button>
                            </div>
                        </div>
                    </div>
                </CarbonCard>
            </div>
        </GlassCard>
    );
}
