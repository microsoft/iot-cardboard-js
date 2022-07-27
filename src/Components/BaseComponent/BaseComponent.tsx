import React, { useContext } from 'react';
import { I18nContext, useTranslation } from 'react-i18next';
import { AdapterResult, IComponentError } from '../..';
import i18n from '../../i18n';
import I18nProviderWrapper from '../../Models/Classes/I18NProviderWrapper';
import { ThemeProvider, Theme } from '../../Theming/ThemeProvider';
import { BaseComponentProps } from './BaseComponent.types';
import { default as ErrorComponent } from '../Error/Error';
import './BaseComponent.scss';
import Overlay from '../Modal/Overlay';
import { Spinner } from '@fluentui/react';

/** Provides wrapper component for theming and localization.
 *  Also provides optional UI states for loading, empty data, and errors.
 *
 *  If provided adapterResults, any catastrophic errors present will be
 *  rendered in error overlay.  This functionality can be short circuited by
 *  explicitly passing a componentError object.
 *
 * Note: If theming or localization providers are already present higher in
 * the component tree, those providers won't be duplicated.
 */
const BaseComponent: React.FC<BaseComponentProps> = ({
    adapterResults,
    children,
    componentError,
    containerClassName,
    customLoadingMessage,
    disableDefaultStyles = false,
    isDataEmpty = false,
    isLoading = false,
    locale,
    localeStrings,
    theme
}) => {
    // Access theme and localization contexts to see if they are already present in component tree
    const localizationContext = useContext(I18nContext);
    const themeContext = useContext(Theme);
    const { t } = useTranslation();

    const catastrophicError: IComponentError = adapterResults?.reduce(
        (acc: IComponentError, curr: AdapterResult<any>) => {
            if (acc) return acc;
            const err = curr?.getCatastrophicError();
            if (err) return err;
            return null;
        },
        null
    );

    const errorToRender: IComponentError = componentError || catastrophicError;
    const showInfo = !errorToRender && (isLoading || isDataEmpty);
    const loadingMessage = customLoadingMessage || t('loading');

    const BaseContents = (
        <div
            className={`${disableDefaultStyles ? '' : 'cb-base-component '} ${
                containerClassName ? containerClassName : ''
            }`}
            cardboard-data-theme={(theme || themeContext) ?? undefined}
        >
            {showInfo && (
                <>
                    {
                        <Overlay>
                            {isLoading ? (
                                <div>
                                    <Spinner label={loadingMessage} />
                                </div>
                            ) : (
                                t('noData')
                            )}
                        </Overlay>
                    }
                </>
            )}
            {errorToRender && (
                <ErrorComponent
                    errorTitle={errorToRender.name}
                    errorContent={
                        errorToRender.message
                            ? errorToRender.message
                            : errorToRender.rawError?.toString()
                    }
                />
            )}
            {children}
        </div>
    );

    if (!localizationContext && !themeContext) {
        // Missing both theming and localization contexts
        return (
            <I18nProviderWrapper
                locale={locale}
                localeStrings={localeStrings}
                i18n={i18n}
            >
                <ThemeProvider theme={theme}>{BaseContents}</ThemeProvider>
            </I18nProviderWrapper>
        );
    } else if (!localizationContext) {
        // Missing only localization context
        return (
            <I18nProviderWrapper
                locale={locale}
                localeStrings={localeStrings}
                i18n={i18n}
            >
                {BaseContents}
            </I18nProviderWrapper>
        );
    } else if (!themeContext) {
        // Missing only theming context
        return <ThemeProvider theme={theme}>{BaseContents}</ThemeProvider>;
    } else {
        // Theming and localization contexts are already present in tree
        return BaseContents;
    }
};

export default BaseComponent;
