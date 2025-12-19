'use client';

import { useUI } from "@/context/UIContext";
import { useEffect } from "react";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    const { theme, language } = useUI();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', language);
    }, [theme, language]);

    return <>{children}</>;
}
