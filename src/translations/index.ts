import { enLabels, labels, type TranslationKey } from './labels';

export type Language = 'en' | 'ar';
export type TranslationParams = Record<string, string | number | undefined | null>;

export { labels, type TranslationKey };

export const defaultLanguage: Language = 'en';

export const hasTranslationKey = (key: string): key is TranslationKey => key in enLabels;

export const interpolateLabel = (template: string, params?: TranslationParams) => {
    if (!params) return template;

    return template.replace(/\{(\w+)\}/g, (_, token: string) => {
        const value = params[token];
        return value === undefined || value === null ? `{${token}}` : String(value);
    });
};

export const getLabel = (language: Language, key: string, params?: TranslationParams) => {
    const dictionary = labels[language] ?? labels[defaultLanguage];

    if (hasTranslationKey(key)) {
        return interpolateLabel(dictionary[key] ?? labels[defaultLanguage][key], params);
    }

    return interpolateLabel(key, params);
};
