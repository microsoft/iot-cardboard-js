import React from 'react';
import OATPropertyEditor from './OATPropertyEditor';
import BaseComponent from '../BaseComponent/BaseComponent';
import { CommandHistoryContextProvider } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import i18n from '../../i18n';
import { OatPageContextProvider } from '../../Models/Context/OatPageContext/OatPageContext';
import { getAvailableLanguages } from '../../Models/Services/OatUtils';
import { getMockModelItem } from '../../Models/Context/OatPageContext/OatPageContext.mock';

export default {
    title: 'Components - OAT/OATPropertyEditor',
    component: OATPropertyEditor
};

const getMockModel = () => {
    const model = getMockModelItem('123');
    model.contents = [
        ...model.contents,
        {
            '@type': 'Property',
            name: 'New_Property1',
            schema: 'dateTime'
        }
    ];
    return model;
};

export const Default = (_args, { globals: { theme, locale } }) => {
    const languages = getAvailableLanguages(i18n);

    return (
        <BaseComponent locale={locale} theme={theme}>
            <OatPageContextProvider>
                <CommandHistoryContextProvider>
                    <OATPropertyEditor
                        languages={languages}
                        selectedItem={getMockModel()}
                        selectedThemeName={theme}
                    />
                </CommandHistoryContextProvider>
            </OatPageContextProvider>
        </BaseComponent>
    );
};
