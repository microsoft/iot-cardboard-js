import React from 'react';
import OATPropertyEditor from './OATPropertyEditor';
import { CommandHistoryContextProvider } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import i18n from '../../i18n';
import { OatPageContextProvider } from '../../Models/Context/OatPageContext/OatPageContext';
import { getAvailableLanguages } from '../../Models/Services/OatUtils';
import {
    getMockFile,
    getMockModelItem
} from '../../Models/Context/OatPageContext/OatPageContext.mock';
import { ComponentStory } from '@storybook/react';
import { IOatPageContextState } from '../../Models/Context/OatPageContext/OatPageContext.types';
import {
    IStoryContext,
    getDefaultStoryDecorator
} from '../../Models/Services/StoryUtilities';

const wrapperStyle: React.CSSProperties = {
    width: 'auto',
    height: '80vh',
    padding: 8
};

type StoryProps = {
    initialState?: Partial<IOatPageContextState>;
};
type SceneBuilderStory = ComponentStory<any>;
const Template: SceneBuilderStory = (
    args: StoryProps,
    context: IStoryContext<any>
) => {
    const languages = getAvailableLanguages(i18n);
    const files = getMockFiles();
    return (
        <OatPageContextProvider
            disableLocalStorage={true}
            initialState={{
                ontologyFiles: files,
                currentOntologyId: 'something',
                selection: {
                    modelId: files[0].data.models[0]['@id']
                },
                ...args?.initialState
            }}
        >
            <CommandHistoryContextProvider>
                <CommandHistoryContextProvider>
                    <OATPropertyEditor
                        languages={languages}
                        selectedItem={getMockModel()}
                        selectedThemeName={
                            context.parameters.theme || context.globals.theme
                        }
                    />
                </CommandHistoryContextProvider>
            </CommandHistoryContextProvider>
        </OatPageContextProvider>
    );
};

export default {
    title: 'Components - OAT/OATPropertyEditor',
    component: OATPropertyEditor,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

const getMockFiles = () => {
    const mockFile = getMockFile(0, '123', '234');
    mockFile.data.models.unshift(getMockModel());
    return [mockFile];
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

export const Base = Template.bind({});
