import React, { useMemo } from 'react';
import OATPropertyEditor from './OATPropertyEditor';
import { CommandHistoryContextProvider } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import i18n from '../../i18n';
import {
    OatPageContextProvider,
    useOatPageContext
} from '../../Models/Context/OatPageContext/OatPageContext';
import {
    buildModelId,
    getAvailableLanguages
} from '../../Models/Services/OatUtils';
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
import { getTargetFromSelection } from './Utils';

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
                    <ComponentRenderer storyContext={context} />
                </CommandHistoryContextProvider>
            </CommandHistoryContextProvider>
        </OatPageContextProvider>
    );
};

interface IRendererProps {
    storyContext: IStoryContext<any>;
}
const ComponentRenderer: React.FC<IRendererProps> = (props) => {
    const { storyContext } = props;
    const languages = getAvailableLanguages(i18n);

    const { oatPageState } = useOatPageContext();
    const selectedModel = useMemo(
        () =>
            oatPageState.selection &&
            getTargetFromSelection(
                oatPageState.currentOntologyModels,
                oatPageState.selection
            ),
        [oatPageState.currentOntologyModels, oatPageState.selection]
    );
    console.log('Test: rendering with selected item', selectedModel);
    return (
        <OATPropertyEditor
            languages={languages}
            selectedItem={selectedModel}
            selectedThemeName={
                storyContext.parameters.theme || storyContext.globals.theme
            }
        />
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
    const modelId = buildModelId({
        modelName: 'model' + 345,
        namespace: 'testNamespace',
        path: 'folder1:folder2',
        version: 2
    });
    const model = getMockModelItem(modelId);
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
