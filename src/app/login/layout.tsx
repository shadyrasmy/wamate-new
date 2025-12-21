import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login - WaMate',
    description: 'Login to your WaMate account.',
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
