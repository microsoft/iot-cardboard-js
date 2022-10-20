import React from 'react';
import { OatPageContextProvider } from '../../Models/Context/OatPageContext/OatPageContext';
import { CommandHistoryContextProvider } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import BaseComponent from '../BaseComponent/BaseComponent';
import OATGraphViewerContent from './OATGraphViewer';

export default {
    title: 'Components - OAT/OATGraphViewer',
    component: OATGraphViewerContent
};

export const Default = (_args, { globals: { theme, locale } }) => {
    return (
        <BaseComponent locale={locale} theme={theme}>
            <OatPageContextProvider>
                <CommandHistoryContextProvider>
                    <OATGraphViewerContent />
                </CommandHistoryContextProvider>
            </OatPageContextProvider>
        </BaseComponent>
    );
};
