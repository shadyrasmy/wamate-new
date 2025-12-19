'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'nova-light';
type Language = 'en' | 'ar';

interface UIContextType {
    theme: Theme;
    language: Language;
    setTheme: (theme: Theme) => void;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
    en: {
        dashboard: "Overview",
        chat_center: "Chat Center",
        instances: "Instances",
        team_seats: "Team Seats",
        settings: "Settings",
        sign_out: "Sign Out",
        upgrade: "Upgrade Plan",
        api_center: "API Center",
        search: "Search...",
        connected: "Connected",
        disconnected: "Disconnected",
        connecting: "Connecting",
        traffic_pulse: "Traffic Pulse",
        system_quota: "System Quota",
        active_channels: "Active Channels",
        outbound_traffic: "Outbound Traffic",
        agent_seats: "Agent Seats",
        theme_toggle: "Theme Mode",
        language_toggle: "Language",
        system_engine: "System Engine",
        baileys_multi: "Baileys Multi",
        socket_cluster: "Socket Cluster",
        queue_manager: "Queue Manager",
        optimal: "Optimal",
        standby: "Standby",
        outbound_msg_vol: "Real-time outbound message volume.",
        need_more_credits: "Need more message credits?",
        view_logs: "VIEW FULL LOGS",
        live_system: "Live System",
        local_identity: "Local Identity",
        enterprise_admin: "Enterprise Admin",
        free_tier: "Free Tier"
    },
    ar: {
        dashboard: "نظرة عامة",
        chat_center: "مركز الدردشة",
        instances: "القنوات",
        team_seats: "مقاعد الفريق",
        settings: "الإعدادات",
        sign_out: "تسجيل الخروج",
        upgrade: "ترقية الباقة",
        api_center: "مركز API",
        search: "بحث...",
        connected: "متصل",
        disconnected: "غير متصل",
        connecting: "جاري الاتصال",
        traffic_pulse: "نبض الرسائل",
        system_quota: "حصة النظام",
        active_channels: "القنوات النشطة",
        outbound_traffic: "الرسائل الصادرة",
        agent_seats: "مقاعد الوكلاء",
        theme_toggle: "المظهر",
        language_toggle: "اللغة",
        system_engine: "محرك النظام",
        baileys_multi: "بيليز المتعدد",
        socket_cluster: "عنقود السوكت",
        queue_manager: "مدير الطابور",
        optimal: "مثالي",
        standby: "استعداد",
        outbound_msg_vol: "حجم الرسائل الصادرة في الوقت الفعلي.",
        need_more_credits: "هل تحتاج إلى المزيد من الرصيد؟",
        view_logs: "عرض السجلات الكاملة",
        live_system: "النظام حي",
        local_identity: "الهوية المحلية",
        enterprise_admin: "مسؤول المؤسسة",
        free_tier: "الفئة المجانية"
    }
};

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('dark');
    const [language, setLanguageState] = useState<Language>('en');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        const savedLang = localStorage.getItem('language') as Language;
        if (savedTheme) setThemeState(savedTheme);
        if (savedLang) setLanguageState(savedLang);
    }, []);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const setLanguage = (newLang: Language) => {
        setLanguageState(newLang);
        localStorage.setItem('language', newLang);
        document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = newLang;
    };

    const t = (key: string) => {
        return translations[language][key] || key;
    };

    return (
        <UIContext.Provider value={{ theme, language, setTheme, setLanguage, t }}>
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (context === undefined) {
        // Fallback for SSR / Static Generation
        return {
            theme: 'dark' as Theme,
            language: 'en' as Language,
            setTheme: () => { },
            setLanguage: () => { },
            t: (key: string) => key
        };
    }
    return context;
}
