import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import enTranslation from './Resources/Locales/en.json';
import deTranslation from './Resources/Locales/de.json';
d;
const resources = {
    en: {
        translation: enTranslation
    },
    de: {
        translation: deTranslation
    }
};

const i18nInstance = i18n;

i18nInstance
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        debug: process.env.NODE_ENV !== 'production',

        interpolation: {
            escapeValue: false // not needed for react!!
        },
        react: {
            useSuspense: true
        }
    });

export default i18nInstance;
