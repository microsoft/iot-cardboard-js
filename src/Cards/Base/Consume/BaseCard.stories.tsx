import React from 'react';
import AdapterResult from '../../../Models/Classes/AdapterResult';
import { AdapterErrorType } from '../../../Models/Constants';
import MockAdapter from '../../../Adapters/MockAdapter';
import useAdapter from '../../../Models/Hooks/useAdapter';
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
                    errorInfo: null
                })
            }
            locale={locale}
        />
    </div>
);

const useMockError = (errorType: AdapterErrorType) => {
    const adapter = new MockAdapter(undefined, 1000, errorType);
    const id = 'errorTest';
    const properties = ['a', 'b', 'c'];
    const cardState = useAdapter({
        adapterMethod: () => adapter.getKeyValuePairs(id, properties),
        refetchDependencies: properties
    });
    return cardState;
};

export const TokenError = (args, { globals: { theme } }) => {
    const cardState = useMockError(AdapterErrorType.TokenRetrievalFailed);

    return (
        <div
            style={{
                height: '400px',
                position: 'relative'
            }}
        >
            <BaseCard
                isLoading={false}
                theme={theme}
                adapterResult={cardState.adapterResult}
            />
        </div>
    );
};

export const DataError = (args, { globals: { theme } }) => {
    const cardState = useMockError(AdapterErrorType.DataFetchFailed);
    return (
        <div
            style={{
                height: '400px',
                position: 'relative'
            }}
        >
            <BaseCard
                isLoading={false}
                theme={theme}
                adapterResult={cardState.adapterResult}
            />
        </div>
    );
};

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
                    errorInfo: null
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
