import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDectector from 'i18next-browser-languagedectactor';

import enTranslation from './locales/en/translation.json';
import frTranslation from './locales/fr/translation.json';
import deTranslation from './locales/de/translation.json';

const resources = {
    en: {
        translation: enTranslation,
    },
    fr: {
        translation: frTranslation,
    },
    de: {
        translation: deTranslation,
    }
}

i18n
    .use(LanguageDectector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'fr',
        debug: false,
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage']
        }
    });

export default i18n;