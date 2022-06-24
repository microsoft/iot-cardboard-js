import { ComponentStory } from '@storybook/react';
import React from 'react';
import { ADT3DSceneBuilderMode, WidgetFormMode } from '../../Models/Constants';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import { ADT3DScenePageContext } from '../../Pages/ADT3DScenePage/ADT3DScenePage';
import {
    ADT3DScenePageState,
    IADT3DScenePageContext
} from '../../Pages/ADT3DScenePage/ADT3DScenePage.types';
import { SceneBuilderContext } from '../ADT3DSceneBuilder/ADT3DSceneBuilder';
import {
    BehaviorTwinAliasFormInfo,
    ElementTwinAliasFormInfo,
    I3DSceneBuilderContext,
    WidgetFormInfo
} from '../ADT3DSceneBuilder/ADT3DSceneBuilder.types';
import { ISceneBreadcrumbFactoryProps } from './SceneBreadcrumb.types';
import SceneBreadcrumbFactory from './SceneBreadcrumbFactory';
import trucksMockVConfig from '../../Adapters/__mockData__/TruckAndMachinesConfig.json';
import { I3DScenesConfig } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

const cardStyle = {
    height: '100px',
    width: 'unset'
};

export default {
    title: 'Components/SceneBreadcrumb',
    component: SceneBreadcrumbFactory,
    decorators: [
        getDefaultStoryDecorator<ISceneBreadcrumbFactoryProps>(cardStyle)
    ]
};

const mockScenePageContext: IADT3DScenePageContext = {
    state: {
        scenesConfig: trucksMockVConfig as I3DScenesConfig
    } as ADT3DScenePageState,
    dispatch: () => {
        return;
    },
    handleOnHomeClick: () => {
        return;
    },
    handleOnSceneClick: () => {
        return;
    },
    handleOnSceneSwap: () => {
        return;
    },
    isTwinPropertyInspectorPatchModeEnabled: false
};

const mockBuilderContext: I3DSceneBuilderContext = {
    widgetFormInfo: {
        mode: WidgetFormMode.Cancelled
    },
    setWidgetFormInfo: (_widgetFormInfo: WidgetFormInfo) => {
        return;
    },
    behaviorTwinAliasFormInfo: null,
    setBehaviorTwinAliasFormInfo: (
        _behaviorTwinAliasFormInfo: BehaviorTwinAliasFormInfo
    ) => {
        return;
    },
    elementTwinAliasFormInfo: null,
    setElementTwinAliasFormInfo: (
        _elementTwinAliasFormInfo: ElementTwinAliasFormInfo
    ) => {
        return;
    }
} as I3DSceneBuilderContext;

/** Base template */
type TemplateStory = ComponentStory<typeof SceneBreadcrumbFactory>;
const BuilderTemplate: TemplateStory = (args: ISceneBreadcrumbFactoryProps) => (
    <SceneBuilderContext.Provider value={mockBuilderContext}>
        <ADT3DScenePageContext.Provider value={mockScenePageContext}>
            <SceneBreadcrumbFactory {...args} />
        </ADT3DScenePageContext.Provider>
    </SceneBuilderContext.Provider>
);

const ViewerTemplate: TemplateStory = (args: ISceneBreadcrumbFactoryProps) => (
    <ADT3DScenePageContext.Provider value={mockScenePageContext}>
        <SceneBreadcrumbFactory {...args} />
    </ADT3DScenePageContext.Provider>
);

/** Breadcrumb as dropdown, in viewer */
const sceneRootBreadcrumbProps: ISceneBreadcrumbFactoryProps = {
    sceneId: '58e02362287440d9a5bf3f8d6d6bfcf9',
    sceneName: 'TruckAndBoxes1',
    onNavigate: () => undefined
};

export const DropdownBreadcrumb = ViewerTemplate.bind({}) as TemplateStory;
DropdownBreadcrumb.args = sceneRootBreadcrumbProps;

/** Breadcrumb as normal items */
const formBreadcrumbProps: ISceneBreadcrumbFactoryProps = {
    sceneId: '58e02362287440d9a5bf3f8d6d6bfcf9',
    sceneName: 'TruckAndBoxes1',
    builderMode: ADT3DSceneBuilderMode.CreateElement,
    onNavigate: () => undefined,
    onSceneClick: () => {
        return;
    }
};

export const FormBreadcrumb = BuilderTemplate.bind({}) as TemplateStory;
FormBreadcrumb.args = formBreadcrumbProps;

/** No name breadcrumb */
const noNameBreadcrumbProps: ISceneBreadcrumbFactoryProps = {
    sceneId: '58e02362287440d9a5bf3f8d6d6bfcf9',
    sceneName: undefined,
    builderMode: ADT3DSceneBuilderMode.CreateElement,
    onNavigate: () => undefined,
    onSceneClick: () => {
        return;
    }
};

export const NoNameBreadcrumb = BuilderTemplate.bind({}) as TemplateStory;
NoNameBreadcrumb.args = noNameBreadcrumbProps;
