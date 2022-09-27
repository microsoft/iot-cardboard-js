import React from 'react';
import OATPropertyEditor from './OATPropertyEditor';
import BaseComponent from '../BaseComponent/BaseComponent';
import { CommandHistoryContextProvider } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import i18n from '../../i18n';
import { OatPageContextProvider } from '../../Models/Context/OatPageContext/OatPageContext';

export default {
    title: 'Components/OATPropertyEditor',
    component: OATPropertyEditor
};

export const Default = (_args, { globals: { theme, locale } }) => {
    const languages = Object.keys(i18n.options.resources).map((language) => {
        return {
            key: (i18n.options.resources[language].translation as any)
                .languageCode,
            text: (i18n.options.resources[language].translation as any)
                .languageName
        };
    });

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
