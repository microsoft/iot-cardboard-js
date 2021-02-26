import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';

export default function I18nProviderWrapper({ children, i18n, locale }) {
    useEffect(() => {
        i18n.changeLanguage(locale);
    }, [i18n, locale]);

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
