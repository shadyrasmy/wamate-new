import { supabase } from '@/lib/supabase';
import { Order, CartItem } from './types/order';

export const OrderRepository = {
    /**
     * Fetch all orders for a specific phone number
     */
    async fetchOrdersByPhone(phone: string): Promise<Order[]> {
        // Normalize phone (assuming input might be a JID like 201000000000@s.whatsapp.net)
        const normalizedPhone = phone.replace('@s.whatsapp.net', '').replace('@lid', '').replace(/\D/g, '');

        // We try variations: with leading +2, with leading 2, or just local
        const phoneVariations = [
            normalizedPhone,
            `+${normalizedPhone}`,
            normalizedPhone.startsWith('2') ? normalizedPhone.substring(1) : `2${normalizedPhone}`,
            `+2${normalizedPhone.startsWith('2') ? normalizedPhone.substring(1) : normalizedPhone}`
        ];

        const { data, error } = await supabase
            .from('orders')
            .select(`
        *,
        cart_items (
          *,
          product:products(*),
          variant:product_variants(*)
        )
      `)
            .in('phone', phoneVariations)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching orders by phone:', error);
            throw error;
        }

        return (data || []) as unknown as Order[];
    },

    /**
     * Update order status
     */
    async updateOrderStatus(orderId: string, status: string): Promise<void> {
        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId);

        if (error) throw error;
    },

    /**
     * Update custom status
     */
    async updateCustomStatus(orderId: string, customStatus: string | null): Promise<void> {
        const { error } = await supabase
            .from('orders')
            .update({ custom_status: customStatus })
            .eq('id', orderId);

        if (error) throw error;
    },

    /**
     * Update delivery status
     */
    async updateDeliveryStatus(orderId: string, deliveryStatus: string | null): Promise<void> {
        const { error } = await supabase
            .from('orders')
            .update({ delivery_status: deliveryStatus })
            .eq('id', orderId);

        if (error) throw error;
    },

    /**
     * Update order details
     */
    async updateOrderDetails(orderId: string, updates: Partial<Order>): Promise<void> {
        const { error } = await supabase
            .from('orders')
            .update(updates as any)
            .eq('id', orderId);

        if (error) throw error;
    },

    /**
     * Add a note to an order
     */
    async updateNotes(orderId: string, notes: string): Promise<void> {
        const { error } = await supabase
            .from('orders')
            .update({ notes })
            .eq('id', orderId);

        if (error) throw error;
    },

    /**
     * Add comments to an order (internal notes)
     */
    async updateInternalNotes(orderId: string, internalNotes: string): Promise<void> {
        const { error } = await supabase
            .from('orders')
            .update({ internal_notes: internalNotes })
            .eq('id', orderId);

        if (error) throw error;
    },

    /**
     * Update order tags
     */
    async updateTags(orderId: string, tags: string[]): Promise<void> {
        const { error } = await supabase
            .from('orders')
            .update({ tags })
            .eq('id', orderId);

        if (error) throw error;
    }
};
