'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultLanguage, getLabel, type Language, type TranslationKey, type TranslationParams } from '@/translations';

type Theme = 'dark' | 'nova-light';

interface UIContextType {
    theme: Theme;
    language: Language;
    setTheme: (theme: Theme) => void;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationKey | string, params?: TranslationParams) => string;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('dark');
    const [language, setLanguageState] = useState<Language>(defaultLanguage);

    const syncDocumentLanguage = (lang: Language) => {
        if (typeof document === 'undefined') return;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        const savedLang = localStorage.getItem('language') as Language;

        if (savedTheme) setThemeState(savedTheme);
        if (savedLang) {
            setLanguageState(savedLang);
            syncDocumentLanguage(savedLang);
        } else {
            syncDocumentLanguage(defaultLanguage);
        }
    }, []);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const setLanguage = (newLang: Language) => {
        setLanguageState(newLang);
        localStorage.setItem('language', newLang);
        syncDocumentLanguage(newLang);
    };

    const t = (key: TranslationKey | string, params?: TranslationParams) => getLabel(language, key, params);

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
            language: defaultLanguage as Language,
            setTheme: () => { },
            setLanguage: () => { },
            t: (key: TranslationKey | string, params?: TranslationParams) => getLabel(defaultLanguage, key, params)
        };
    }
    return context;
}
