import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard - WaMate',
    description: 'Manage your WhatsApp automation instances and settings.',
};

import DashboardLayout from './layout.client';

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DashboardLayout>{children}</DashboardLayout>;
}
