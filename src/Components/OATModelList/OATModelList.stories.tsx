import React from 'react';
import BaseComponent from '../BaseComponent/BaseComponent';
import OATModelList from './OATModelList';
import { CommandHistoryContextProvider } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { OatPageContextProvider } from '../../Models/Context/OatPageContext/OatPageContext';

export default {
    title: 'Components - OAT/OATModelList',
    component: OATModelList
};

export const Default = (_args, { globals: { theme, locale } }) => {
    return (
        <BaseComponent theme={theme} locale={locale}>
            <OatPageContextProvider>
                <CommandHistoryContextProvider>
                    <OATModelList />
                </CommandHistoryContextProvider>
            </OatPageContextProvider>
        </BaseComponent>
    );
};
