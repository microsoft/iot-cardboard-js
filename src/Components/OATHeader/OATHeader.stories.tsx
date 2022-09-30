import React from 'react';
import OATHeader from './OATHeader';
import BaseComponent from '../BaseComponent/BaseComponent';
import { CommandHistoryContextProvider } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { OatPageContextProvider } from '../../Models/Context/OatPageContext/OatPageContext';

export default {
    title: 'Components - OAT/OATHeader',
    component: OATHeader
};

export const Default = (_args, { globals: { theme, locale } }) => {
    return (
        <BaseComponent locale={locale} theme={theme}>
            <OatPageContextProvider>
                <CommandHistoryContextProvider>
                    <OATHeader />
                </CommandHistoryContextProvider>
            </OatPageContextProvider>
        </BaseComponent>
    );
};
