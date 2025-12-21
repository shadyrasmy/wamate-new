import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Register - WaMate',
    description: 'Create your WaMate account today.',
};

export default function RegisterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
