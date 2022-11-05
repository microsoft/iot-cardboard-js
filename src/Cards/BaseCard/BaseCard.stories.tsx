import React from 'react';
import MockAdapter from '../../Adapters/MockAdapter';
import { AdapterResult } from '../../Models/Classes';
import { ComponentErrorType, Locale } from '../../Models/Constants';
import useAdapter from '../../Models/Hooks/useAdapter';
import BaseCard from './BaseCard';

export default {
    title: 'Cards/BaseCard',
    component: BaseCard
};

export const BasicCardNoData = (_args, { globals: { theme, locale } }) => (
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

const useMockError = (errorType: ComponentErrorType) => {
    const adapter = new MockAdapter({
        mockError: { type: errorType }
    });
    const id = 'errorTest';
    const properties = ['a', 'b', 'c'];
    const cardState = useAdapter({
        adapterMethod: () =>
            adapter.getKeyValuePairs(id, properties, {
                isTimestampIncluded: true
            }),
        refetchDependencies: [...properties, errorType]
    });
    return cardState;
};

export const CatastrophicErrors = (args, { globals: { theme } }) => {
    const cardState = useMockError(args.errorType);

    return (
        <div
            style={{
                height: '400px',
                position: 'relative'
            }}
        >
            <BaseCard
                isLoading={cardState.isLoading}
                theme={theme}
                adapterResult={cardState.adapterResult}
            />
        </div>
    );
};

CatastrophicErrors.argTypes = {
    errorType: {
        control: {
            type: 'radio',
            options: [...Object.keys(ComponentErrorType)]
        },
        defaultValue: ComponentErrorType.TokenRetrievalFailed,
        description: 'Test'
    }
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
