import React, { useCallback, useReducer } from 'react';
import {
    IIngressAppProps,
    IIngressAppStyleProps,
    IIngressAppStyles
} from './IngressApp.types';
import { getStyles } from './IngressApp.styles';
import { classNamesFunction, IconButton, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import BaseComponent from '../../../../Components/BaseComponent/BaseComponent';
import HomePage from '../../Components/HomePage/HomePage';
import {
    getInitialState,
    NavigationContext,
    NavigationContextReducer
} from '../../Models/Context/NavigationContext';
import {
    NavigationContextActionType,
    PageNames
} from '../../Models/Context/NavigationContext.types';

const getClassNames = classNamesFunction<
    IIngressAppStyleProps,
    IIngressAppStyles
>();

const IngressApp: React.FC<IIngressAppProps> = (props) => {
    const { adapter, locale, localeStrings, styles, theme } = props;

    // contexts

    // state
    const [navigationContextState, navigationContextDispatch] = useReducer(
        NavigationContextReducer,
        getInitialState()
    );

    // hooks

    // callbacks
    const navigateHome = useCallback(() => {
        navigationContextDispatch({
            type: NavigationContextActionType.NAVIGATE_TO,
            payload: {
                pageName: PageNames.Home
            }
        });
    }, []);

    const renderCurrentPage = useCallback((currentPage: PageNames) => {
        switch (currentPage) {
            case PageNames.Home:
                return <HomePage adapter={adapter} />;
            // TODO: Add pages here when they are ready to be added
            case PageNames.TemplatesForm:
            case PageNames.SourceMappingForm:
            case PageNames.EventHandlerForm:
            case PageNames.SubscriptionsForm:
                return (
                    <>
                        <IconButton
                            iconProps={{ iconName: 'Back' }}
                            onClick={navigateHome}
                        />
                        <p>{currentPage} page still in progress.</p>
                    </>
                );
        }
    }, []);

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    return (
        <BaseComponent
            isLoading={false}
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
            containerClassName={classNames.root}
        >
            <NavigationContext.Provider
                value={{ navigationContextState, navigationContextDispatch }}
            >
                {renderCurrentPage(navigationContextState.currentPage)}
            </NavigationContext.Provider>
        </BaseComponent>
    );
};

export default styled<
    IIngressAppProps,
    IIngressAppStyleProps,
    IIngressAppStyles
>(IngressApp, getStyles);
