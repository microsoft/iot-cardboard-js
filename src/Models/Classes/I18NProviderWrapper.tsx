import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Locale } from '../Constants/Enums';

export default function I18nProviderWrapper({
    children,
    locale,
    localeStrings = undefined,
    i18n,
}) {
    useEffect(() => {
        if (localeStrings) {
            i18n.addResourceBundle(
                // keep existing nested translation and overwrite those with the new ones
                locale || i18n.language || Locale.EN, // assign localeStrings to the provided locale prop, if there is not to the last used detected language; otherwise to default language EN
                'translation',
                localeStrings,
                true,
                true,
            );
        }
        i18n.changeLanguage(locale);
    }, [i18n, locale, localeStrings]);

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
