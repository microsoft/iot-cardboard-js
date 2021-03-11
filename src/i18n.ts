import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import enTranslation from './Resources/Locales/en/translation.json';
import deTranslation from './Resources/Locales/de/translation.json';

const resources = {
    en: {
        translation: enTranslation
    },
    de: {
        translation: deTranslation
    }
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        debug: process.env.NODE_ENV !== 'production',

        interpolation: {
            escapeValue: false // not needed for react!!
        }
    });

export default i18n;
