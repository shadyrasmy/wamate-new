export interface OrderVariationProp {
  id: string;
  variation: string;
  variation_prop: string;
  product_variant_id: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  price: number;
  sale_price: number;
  quantity: number;
  taager_code: string;
  variation_props: OrderVariationProp[];
}

export interface Product {
  id: string;
  updated_at: string;
  created_at: string;
  store_id: string;
  name: string;
  price: number;
  sku?: string;
  taager_code?: string;
  drop_shipping_provider?: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  variant_id?: string;
  store_id: string;
  price: number;
  quantity: number;
  product: Product;
  variant?: ProductVariant;
}

export interface Order {
  id: string;
  updated_at: string;
  created_at: string;
  store_id: string;
  cost: number;
  shipping_cost: number;
  total_cost: number;
  status: string;
  custom_status?: string;
  delivery_status?: string;
  delivery_returned_status?: string;
  full_name: string;
  phone: string;
  extra_phone?: string;
  order_source?: string;
  government: string;
  address: string;
  payment_method: string;
  payment_status?: string;
  deposit_amount?: number;
  notes?: string;
  internal_notes?: string;
  cart_items: CartItem[];
  inventory_deducted?: boolean;
  tags?: string[];
}

export interface OrderStatus {
  id: string;
  user_id: string;
  order_id: string;
  store_id: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ConnectedStore {
  id: string;
  user_id: string;
  store_name: string;
  api_key: string;
  store_id: string;
  is_active: boolean;
  webhook_url?: string;
  webhook_secret: string;
  app_installed: boolean;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export const CUSTOM_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'bg-slate-500/20 dark:bg-slate-500/30 border-slate-500/30 dark:border-slate-500/50 text-slate-700 dark:text-slate-400' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-green-500/20 dark:bg-green-500/30 border-green-500/30 dark:border-green-500/50 text-green-700 dark:text-green-400' },
  { value: 'confirmed_whatsapp', label: 'Confirmed WhatsApp', color: 'bg-emerald-500/20 dark:bg-emerald-500/30 border-emerald-500/30 dark:border-emerald-500/50 text-emerald-700 dark:text-emerald-400' },
  { value: 'confirmed_call', label: 'Confirmed Call', color: 'bg-teal-500/20 dark:bg-teal-500/30 border-teal-500/30 dark:border-teal-500/50 text-teal-700 dark:text-teal-400' },
  { value: 'sent_whatsapp', label: 'Sent WhatsApp', color: 'bg-cyan-500/20 dark:bg-cyan-500/30 border-cyan-500/30 dark:border-cyan-500/50 text-cyan-700 dark:text-cyan-400' },
  { value: 'sent to delivery', label: 'Sent to Delivery', color: 'bg-purple-500/20 dark:bg-purple-500/30 border-purple-500/30 dark:border-purple-500/50 text-purple-700 dark:text-purple-400' },
  { value: 'MK', label: 'MK', color: 'bg-indigo-500/20 dark:bg-indigo-500/30 border-indigo-500/30 dark:border-indigo-500/50 text-indigo-700 dark:text-indigo-400' },
  { value: 'markitos', label: 'Markitos', color: 'bg-pink-500/20 dark:bg-pink-500/30 border-pink-500/30 dark:border-pink-500/50 text-pink-700 dark:text-pink-400' },
  { value: 'uploaded_to_system', label: 'Uploaded to System', color: 'bg-blue-500/20 dark:bg-blue-500/30 border-blue-500/30 dark:border-blue-500/50 text-blue-700 dark:text-blue-400' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500/20 dark:bg-red-500/30 border-red-500/30 dark:border-red-500/50 text-red-700 dark:text-red-400' },
  { value: 'no_reply_phone', label: "Doesn't Reply Phone", color: 'bg-yellow-500/20 dark:bg-yellow-500/30 border-yellow-500/30 dark:border-yellow-500/50 text-yellow-700 dark:text-yellow-400' },
  { value: 'no_reply_whatsapp', label: "Doesn't Reply WhatsApp", color: 'bg-orange-500/20 dark:bg-orange-500/30 border-orange-500/30 dark:border-orange-500/50 text-orange-700 dark:text-orange-400' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-600/20 dark:bg-green-600/30 border-green-600/30 dark:border-green-600/50 text-green-700 dark:text-green-400' },
  { value: 'returned', label: 'Returned', color: 'bg-rose-500/20 dark:bg-rose-500/30 border-rose-500/30 dark:border-rose-500/50 text-rose-700 dark:text-rose-400' },
  { value: 'postponed', label: 'Postponed', color: 'bg-amber-500/20 dark:bg-amber-500/30 border-amber-500/30 dark:border-amber-500/50 text-amber-700 dark:text-amber-400' },
  { value: 'out_for_delivery', label: 'Out for Delivery', color: 'bg-sky-500/20 dark:bg-sky-500/30 border-sky-500/30 dark:border-sky-500/50 text-sky-700 dark:text-sky-400' },
  { value: 'replacment', label: 'Replacement', color: 'bg-violet-500/20 dark:bg-violet-500/30 border-violet-500/30 dark:border-violet-500/50 text-violet-700 dark:text-violet-400' },
] as const;
