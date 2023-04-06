import React from 'react';
import { classNamesFunction, styled } from '@fluentui/react';
import {
    IStoreListPageProps,
    IStoreListPageStyleProps,
    IStoreListPageStyles
} from './StoreListPage.types';
import { getStyles } from './StoreListPage.styles';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';

const debugLogging = false;
const logDebugConsole = getDebugLogger('StoreListPage', debugLogging);

const getClassNames = classNamesFunction<
    IStoreListPageStyleProps,
    IStoreListPageStyles
>();

const StoreListPage: React.FC<IStoreListPageProps> = (props) => {
    const { styles } = props;

    // contexts

    // state

    // hooks

    // callbacks

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    logDebugConsole('debug', 'Render');

    return <div className={classNames.root}>Hello StoreListPage!</div>;
};

export default styled<
    IStoreListPageProps,
    IStoreListPageStyleProps,
    IStoreListPageStyles
>(StoreListPage, getStyles);
