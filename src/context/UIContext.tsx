'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'nova-light';

interface UIContextType {
    theme: Theme;
    language: Language;
    setTheme: (theme: Theme) => void;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

import { translations, Language } from '@/translations';

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
        if (typeof document !== 'undefined') {
            document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = newLang;
        }
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
