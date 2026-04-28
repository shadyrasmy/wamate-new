import type { Language } from './index';

export type LocalizedValue =
    | string
    | null
    | undefined
    | {
        en?: string | null;
        ar?: string | null;
    };

const isLocalizedObject = (value: LocalizedValue): value is { en?: string | null; ar?: string | null } => {
    return value !== null && typeof value === 'object' && ('en' in value || 'ar' in value);
};

export const getLocalizedValue = (
    value: LocalizedValue,
    language: Language,
    fallback = ''
) => {
    if (typeof value === 'string') return value || fallback;
    if (isLocalizedObject(value)) {
        return value[language] || value.en || value.ar || fallback;
    }
    return fallback;
};

export const setLocalizedValue = (
    value: LocalizedValue,
    language: Language,
    nextValue: string
) => {
    const current =
        typeof value === 'string'
            ? { en: value, ar: value }
            : isLocalizedObject(value)
                ? { en: value.en || '', ar: value.ar || '' }
                : { en: '', ar: '' };

    return {
        ...current,
        [language]: nextValue
    };
};
