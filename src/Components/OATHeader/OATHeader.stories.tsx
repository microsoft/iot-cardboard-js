import React from 'react';
import OATHeader from './OATHeader';
import { CommandHistoryContextProvider } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import {
    OatPageContextProvider,
    useOatPageContext
} from '../../Models/Context/OatPageContext/OatPageContext';
import { Label, Separator, Stack } from '@fluentui/react';
import {
    getDefaultStoryDecorator,
    IStoryContext
} from '../../Models/Services/StoryUtilities';
import { ComponentStory } from '@storybook/react';
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
                        {oatPageState.currentOntologyNamespace}
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
const makeTestProjects = (): IOATFile[] => {
    const defaultProject: IOATFile = {
        id: DEFAULT_PROJECT_ID,
        data: new ProjectData('test-name-1', 'test-namespace', [
            new DTDLModel(
                'id-1',
                'model-1',
                'description-1',
                'comment-1',
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
                []
            )
        ])
    };
    const project2: IOATFile = {
        id: 'test-project-2',
        data: new ProjectData('test-name-2', 'test-namespace-2', [
            new DTDLModel(
                'id-2',
                'model-2',
                'description-2',
                'comment-2',
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
                []
            )
        ])
    };
    return [defaultProject, project2];
};
type StoryProps = {
    projectId: string;
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
                [
                    new DTDLModel(
                        'id-1',
                        'model-1',
                        'description-1',
                        'comment-1',
                        [],
                        [],
                        []
                    )
                ]
            )
        }
    ]
} as StoryProps;
