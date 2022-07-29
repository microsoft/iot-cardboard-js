import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import csTranslation from './Resources/Locales/cs.json';
import deTranslation from './Resources/Locales/de.json';
import enTranslation from './Resources/Locales/en.json';
import esTranslation from './Resources/Locales/es.json';
import frTranslation from './Resources/Locales/fr.json';
import huTranslation from './Resources/Locales/hu.json';
import itTranslation from './Resources/Locales/it.json';
import jaTranslation from './Resources/Locales/ja.json';
import koTranslation from './Resources/Locales/ko.json';
import nlTranslation from './Resources/Locales/nl.json';
import plTranslation from './Resources/Locales/pl.json';
import ptTranslation from './Resources/Locales/pt.json';
import ptPtTranslation from './Resources/Locales/pt-pt.json';
import ruTranslation from './Resources/Locales/ru.json';
import svTranslation from './Resources/Locales/sv.json';
import trTranslation from './Resources/Locales/tr.json';
import zhTranslation from './Resources/Locales/zh-Hans.json';

const resources = {
    cs: { translation: csTranslation },
    de: { translation: deTranslation },
    en: { translation: enTranslation },
    es: { translation: esTranslation },
    fr: { translation: frTranslation },
    hu: { translation: huTranslation },
    it: { translation: itTranslation },
    ja: { translation: jaTranslation },
    ko: { translation: koTranslation },
    nl: { translation: nlTranslation },
    pl: { translation: plTranslation },
    pt: { translation: ptTranslation },
    ptPt: { translation: ptPtTranslation },
    ru: { translation: ruTranslation },
    sv: { translation: svTranslation },
    tr: { translation: trTranslation },
    zhHans: { translation: zhTranslation }
};

const i18nInstance = i18n;

i18nInstance
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        debug:
            process.env.NODE_ENV !== 'production' &&
            process.env.isTestMode !== 'true',

        interpolation: {
            escapeValue: false // not needed for react!!
        },
        react: {
            useSuspense: true
        }
    });

export default i18nInstance;
