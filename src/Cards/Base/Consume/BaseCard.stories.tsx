import React from 'react';
import AdapterResult from '../../../Models/Classes/AdapterResult';
import { Locale } from '../../../Models/Constants/Enums';
import BaseCard from './BaseCard';

export default {
    title: 'BaseCard/Consume'
};

export const BasicCard = (args, { globals: { theme, locale } }) => (
    <div
        style={{
            height: '400px',
            position: 'relative'
        }}
    >
        <BaseCard
            isLoading={false}
            theme={theme}
            adapterResult={
                new AdapterResult({
                    result: null,
                    error: null
                })
            }
            locale={locale}
        />
    </div>
);

export const BasicCardWithCustomTranslation = (
    args,
    { globals: { theme, locale } }
) => (
    <div
        style={{
            height: '400px',
            position: 'relative'
        }}
    >
        <BaseCard
            isLoading={false}
            theme={theme}
            adapterResult={
                new AdapterResult({
                    result: null,
                    error: null
                })
            }
            locale={(args.locale as Locale) || locale}
            localeStrings={
                args.localeStrings ? JSON.parse(args.localeStrings) : undefined
            }
        />
    </div>
);

const customTranslations = {
    en: {
        translation: {
            preview: 'MyPreview-EN',
            loading: 'MyLoading...-EN',
            noData: 'MyNo data-EN'
        }
    },
    de: {
        translation: {
            preview: 'MyPreview-DE',
            loading: 'MyLoading...-DE',
            noData: 'MyNo data-DE'
        }
    },
    fr: {
        translation: {
            preview: 'MyPreview-FR',
            loading: 'MyLoading...-FR',
            noData: 'MyNo data-FR'
        }
    }
};

BasicCardWithCustomTranslation.argTypes = {
    locale: {
        control: {
            type: 'radio',
            options: [undefined, 'en', 'de']
        },
        defaultValue: undefined
    },
    localeStrings: {
        control: {
            type: 'radio',
            options: [
                undefined,
                JSON.stringify(customTranslations.en.translation),
                JSON.stringify(customTranslations.de.translation),
                JSON.stringify(customTranslations.fr.translation)
            ]
        },
        defaultValue: undefined
    }
};
