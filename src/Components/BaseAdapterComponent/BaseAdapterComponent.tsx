import React from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import I18nProviderWrapper from '../../Models/Classes/I18NProviderWrapper';
import { ThemeProvider } from '../../Theming/ThemeProvider';
import { BaseAdapterComponentProps } from './BaseAdapterComponent.types';

const BaseAdapterComponent: React.FC<BaseAdapterComponentProps> = ({
    adapterResults,
    theme,
    isLoading = false,
    noData = false,
    locale,
    localeStrings,
    children
}) => {
    const { t } = useTranslation();

    const catastrophicError = adapterResults?.reduce((acc, curr) => {
        if (acc) return acc;
        const err = curr?.getCatastrophicError();
        if (err) return err;
    }, null);

    return (
        <I18nProviderWrapper
            locale={locale}
            localeStrings={localeStrings}
            i18n={i18n}
        >
            <ThemeProvider theme={theme}>
                <div className="cb-base-adapter-component">
                    {isLoading && (
                        <div className="cb-base-adapter-component-loading-overlay">
                            <div className="cb-base-adapter-component-loading">
                                Loading...
                            </div>
                        </div>
                    )}

                    {children}
                </div>
            </ThemeProvider>
        </I18nProviderWrapper>
    );
};
