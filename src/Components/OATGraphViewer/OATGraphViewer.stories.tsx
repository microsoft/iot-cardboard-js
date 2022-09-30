import React from 'react';
import { OatPageContextProvider } from '../../Models/Context/OatPageContext/OatPageContext';
import { CommandHistoryContextProvider } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import BaseComponent from '../BaseComponent/BaseComponent';
import OATGraphViewer from './OATGraphViewer';

export default {
    title: 'Components - OAT/OATGraphViewer',
    component: OATGraphViewer
};

export const Default = (_args, { globals: { theme, locale } }) => {
    return (
        <BaseComponent locale={locale} theme={theme}>
            <OatPageContextProvider>
                <CommandHistoryContextProvider>
                    <OATGraphViewer />
                </CommandHistoryContextProvider>
            </OatPageContextProvider>
        </BaseComponent>
    );
};
