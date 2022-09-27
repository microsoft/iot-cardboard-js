import React from 'react';
import OATPropertyEditor from './OATPropertyEditor';
import BaseComponent from '../BaseComponent/BaseComponent';
import { CommandHistoryContextProvider } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import i18n from '../../i18n';
import { OatPageContextProvider } from '../../Models/Context/OatPageContext/OatPageContext';
import { getAvailableLanguages } from '../../Models/Services/OatUtils';

export default {
    title: 'Components/OATPropertyEditor',
    component: OATPropertyEditor
};

export const Default = (_args, { globals: { theme, locale } }) => {
    const languages = getAvailableLanguages(i18n);

    return (
        <BaseComponent locale={locale} theme={theme}>
            <OatPageContextProvider>
                <CommandHistoryContextProvider>
                    <OATPropertyEditor theme={theme} languages={languages} />
                </CommandHistoryContextProvider>
            </OatPageContextProvider>
        </BaseComponent>
    );
};
