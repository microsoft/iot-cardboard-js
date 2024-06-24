import React from 'react';
import { ComponentStory } from '@storybook/react';
import { Label, Separator, Stack } from '@fluentui/react';
import { userEvent, within, screen } from '@storybook/testing-library';
import OATHeader from './OATHeader';
import { CommandHistoryContextProvider } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import {
    OatPageContextProvider,
    useOatPageContext
} from '../../Models/Context/OatPageContext/OatPageContext';
import {
    findCalloutItemByTestId,
    getDefaultStoryDecorator,
    IStoryContext,
    sleep,
    waitForAnimations
} from '../../Models/Services/StoryUtilities';
import { DTDLModel } from '../../Models/Classes/DTDL';
import { IOATFile } from '../../Pages/OATEditorPage/Internal/Classes/OatTypes';
import { ProjectData } from '../../Pages/OATEditorPage/Internal/Classes';

const wrapperStyle: React.CSSProperties = {
    width: 500,
    padding: 8
};
export default {
    title: 'Components - OAT/OATHeader',
    component: OATHeader,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

const ContextRenderer: React.FC = () => {
    const { oatPageState } = useOatPageContext();
    return (
        <>
            <Stack tokens={{ childrenGap: 8 }}>
                <Stack tokens={{ childrenGap: 8 }}>
                    <h4>Projects in context:</h4>
                    {oatPageState.ontologyFiles.map((x) => {
                        return (
                            <div key={x.id}>
                                {x.id}: {x.data.projectName}
                            </div>
                        );
                    })}
                </Stack>
                <Separator />
                <Stack tokens={{ childrenGap: 8 }}>
                    <h4>Current ontology</h4>
                    <div>
                        <Label>OntologyId:</Label>{' '}
                        {oatPageState.currentOntologyId}
                    </div>
                    <div>
                        <Label>Ontology name:</Label>{' '}
                        {oatPageState.currentOntologyProjectName}
                    </div>
                    <div>
                        <Label>Namespace:</Label>{' '}
                        {oatPageState.currentOntologyDefaultPath}
                    </div>
                    <div>
                        <Label>Models:</Label>{' '}
                        {JSON.stringify(
                            oatPageState.currentOntologyModels || []
                        )}
                    </div>
                    <div>
                        <Label>Positions:</Label>{' '}
                        {JSON.stringify(
                            oatPageState.currentOntologyModelPositions || []
                        )}
                    </div>
                    <div>
                        <Label>Templates:</Label>{' '}
                        {JSON.stringify(
                            oatPageState.currentOntologyTemplates || []
                        )}
                    </div>
                </Stack>
            </Stack>
        </>
    );
};

const DEFAULT_PROJECT_ID = 'test-project-1';
const DEFAULT_PROJECT_NAME_1 = 'test-name-1';
const DEFAULT_PROJECT_NAME_2 = 'test-name-2';
const makeTestProjects = (): IOATFile[] => {
    const defaultProject: IOATFile = {
        id: DEFAULT_PROJECT_ID,
        data: new ProjectData(DEFAULT_PROJECT_NAME_1, 'test-namespace', null, [
            new DTDLModel(
                'id-1',
                'model-1',
                'description-1',
                'comment-1',
                [],
                [],
                [],
                []
            ),
            new DTDLModel(
                'id-2',
                'model-2',
                'description-2',
                'comment-2',
                [],
                [],
                [],
                []
            )
        ])
    };
    const project2: IOATFile = {
        id: 'test-project-2',
        data: new ProjectData(
            DEFAULT_PROJECT_NAME_2,
            'test-namespace-2',
            null,
            [
                new DTDLModel(
                    'id-2',
                    'model-2',
                    'description-2',
                    'comment-2',
                    [],
                    [],
                    [],
                    []
                ),
                new DTDLModel(
                    'id-3',
                    'model-3',
                    'description-3',
                    'comment-3',
                    [],
                    [],
                    [],
                    []
                )
            ]
        )
    };
    return [defaultProject, project2];
};
type StoryProps = {
    projectId?: string;
    files?: IOATFile[];
};
type SceneBuilderStory = ComponentStory<any>;
const Template: SceneBuilderStory = (
    args: StoryProps,
    _context: IStoryContext<any>
) => {
    const { projectId, files } = args;
    return (
        <OatPageContextProvider
            initialState={{
                currentOntologyId: projectId || DEFAULT_PROJECT_ID,
                ontologyFiles: files || makeTestProjects()
            }}
            disableLocalStorage={true}
        >
            <CommandHistoryContextProvider>
                <OATHeader />
                <ContextRenderer />
            </CommandHistoryContextProvider>
        </OatPageContextProvider>
    );
};

export const Base = Template.bind({});
Base.args = {
    projectId: DEFAULT_PROJECT_ID,
    files: makeTestProjects()
} as StoryProps;

export const FileMenu = Template.bind({});
FileMenu.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Finds the menu and opens it
    const menu = await canvas.findByTestId('oat-header-ontology-menu');
    userEvent.click(menu);

    // wait for the menu
    await sleep(100);
};

export const FileNew = Template.bind({});
FileNew.play = async (context) => {
    await FileMenu.play(context);

    // click the sub menu button
    const button = await findCalloutItemByTestId(
        'oat-header-ontology-menu-new'
    );
    button.click();
};

export const FileEdit = Template.bind({});
FileEdit.play = async (context) => {
    await FileMenu.play(context);

    // click the sub menu button
    const button = await findCalloutItemByTestId(
        'oat-header-ontology-menu-manage'
    );
    button.click();
};

export const FileDuplicate = Template.bind({});
FileDuplicate.play = async (context) => {
    await FileMenu.play(context);

    // click the sub menu button
    const button = await findCalloutItemByTestId(
        'oat-header-ontology-menu-copy'
    );
    button.click();
};

export const FileSwitch = Template.bind({});
FileSwitch.play = async (context) => {
    await FileMenu.play(context);

    // click the sub menu button
    const button = await findCalloutItemByTestId(
        'oat-header-ontology-menu-switch'
    );
    button.click();

    // click the other project
    const projectSubMenuItem = await screen.findAllByTitle(
        DEFAULT_PROJECT_NAME_2
    );
    await waitForAnimations();
    projectSubMenuItem[1].click();
};

export const LongName = Template.bind({});
LongName.args = {
    projectId: 'long-name-id',
    files: [
        ...makeTestProjects(),
        {
            id: 'long-name-id',
            data: new ProjectData(
                'Super long project name - Super long project name - Super long project name - Super long project name - Super long project name - Super long project name - Super long project name - Super long project name - Super long project name - Super long project name - ',
                'test-namespace',
                null,
                [
                    new DTDLModel(
                        'id-1',
                        'model-1',
                        'description-1',
                        'comment-1',
                        [],
                        [],
                        [],
                        []
                    )
                ]
            )
        }
    ]
} as StoryProps;
