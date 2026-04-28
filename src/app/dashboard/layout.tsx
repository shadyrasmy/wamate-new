import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard | لوحة التحكم - WaMate',
    description: 'Manage your WhatsApp automation instances and settings | إدارة قنوات واتساب والإعدادات',
};

import DashboardLayout from './layout.client';

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DashboardLayout>{children}</DashboardLayout>;
}
