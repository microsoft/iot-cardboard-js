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
    getDefaultStoryDecorator,
    sleep
} from '../../Models/Services/StoryUtilities';
import { getTargetFromSelection } from './Utils';
import { IOATSelection } from '../../Pages/OATEditorPage/OATEditorPage.types';
import { IOATFile } from '../../Pages/OATEditorPage/Internal/Classes/OatTypes';
import { userEvent, within } from '@storybook/testing-library';
import {
    DtdlInterfaceContent,
    OAT_RELATIONSHIP_HANDLE_NAME
} from '../../Models/Constants';
import { DTDLProperty } from '../../Models/Classes/DTDL';

const wrapperStyle: React.CSSProperties = {
    width: 'auto',
    height: '80vh',
    padding: 8
};

export default {
    title: 'Components - OAT/OATPropertyEditor',
    component: OATPropertyEditor,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

type StoryProps = {
    files: IOATFile[];
    selection: IOATSelection;
    initialState?: Partial<IOatPageContextState>;
};
type SceneBuilderStory = ComponentStory<any>;
const Template: SceneBuilderStory = (
    args: StoryProps,
    context: IStoryContext<any>
) => {
    return (
        <OatPageContextProvider
            disableLocalStorage={true}
            initialState={{
                ontologyFiles: args.files,
                currentOntologyId: 'something',
                selection: args.selection,
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

    const relationship: DtdlInterfaceContent = {
        '@type': 'Relationship',
        '@id': modelId + '_Relationship_0',
        name: 'Relationship_0',
        target: 'dtmi:testNamespace:model1;1',
        properties: [
            new DTDLProperty(
                'property1',
                'Length',
                'double',
                '',
                '',
                'Length',
                '',
                true
            )
        ]
    };
    model.contents = [
        ...model.contents,
        relationship,
        {
            '@type': 'Property',
            name: 'New_Property1',
            schema: 'dateTime'
        }
    ];
    return model;
};

export const ModelSelectedEditorModel = Template.bind({});
ModelSelectedEditorModel.args = (() => {
    const files = getMockFiles();
    const args: StoryProps = {
        files: files,
        selection: { modelId: files[0].data.models[0]['@id'] }
    };
    return args;
})();

export const ModelSelectedEditorRelationship = Template.bind({});
ModelSelectedEditorRelationship.args = (() => {
    const files = getMockFiles();
    const firstModel = files[0].data.models[0];
    const args: StoryProps = {
        files: files,
        selection: {
            modelId: firstModel['@id'],
            contentId: firstModel.contents.find(
                (x: DtdlInterfaceContent) =>
                    x['@type'] === OAT_RELATIONSHIP_HANDLE_NAME
            )?.name
        }
    };
    return args;
})();

export const ModelSelectedJson = Template.bind({});
ModelSelectedJson.args = (() => {
    const files = getMockFiles();
    const args: StoryProps = {
        files: files,
        selection: { modelId: files[0].data.models[0]['@id'] }
    };
    return args;
})();
ModelSelectedJson.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Finds the menu and opens it
    const tab = (await canvas.findAllByRole('tab'))[1];
    userEvent.click(tab);

    // wait for the menu
    await sleep(10);
};
