import React from 'react';
import { ComponentStory } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import MockAdapter from '../../Adapters/MockAdapter';
import ADT3DSceneBuilder from './ADT3DSceneBuilder';
import {
    clickOverFlowMenuItem,
    findCalloutItemByTestId,
    findOverflowMenuItem,
    IStoryContext,
    selectDropDownMenuItem,
    sleep
} from '../../Models/Services/StoryUtilities';
import { IADT3DSceneBuilderCardProps } from './ADT3DSceneBuilder.types';
import trucksMockVConfig from '../../Adapters/__mockData__/TruckAndMachinesConfig.json';
import { deepCopy } from '../../Models/Services/Utils';
import {
    WidgetsListAddDialogShow,
    WidgetsListMore
} from './ADT3DSceneBuilder.WidgetsList.stories';
import { ADT3DScenePageContext } from '../../Pages/ADT3DScenePage/ADT3DScenePage';
import {
    ADXConnectionInformationLoadingState,
    IADT3DScenePageContext,
    IADT3DScenePageState
} from '../../Pages/ADT3DScenePage/ADT3DScenePage.types';
import { I3DScenesConfig } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

export default {
    title: 'Components/ADT3DSceneBuilder/WidgetsForm',
    component: ADT3DSceneBuilder
};

const cardStyle = {
    height: '600px',
    width: '100%'
};

const mockScenePageContext: IADT3DScenePageContext = {
    state: {
        scenesConfig: trucksMockVConfig as I3DScenesConfig,
        adxConnectionInformation: {
            connection: null,
            loadingState: ADXConnectionInformationLoadingState.IDLE
        }
    } as IADT3DScenePageState,
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

type SceneBuilderStory = ComponentStory<typeof ADT3DSceneBuilder>;
const Template: SceneBuilderStory = (
    _args,
    context: IStoryContext<IADT3DSceneBuilderCardProps>
) => {
    return (
        <ADT3DScenePageContext.Provider value={mockScenePageContext}>
            <div style={cardStyle}>
                <ADT3DSceneBuilder
                    title={'3D Scene Builder'}
                    theme={context.globals.theme}
                    locale={context.globals.locale}
                    adapter={
                        new MockAdapter({
                            mockData: {
                                scenesConfig: context.parameters.data
                                    ? deepCopy(context.parameters.data)
                                    : trucksMockVConfig
                            }
                        })
                    }
                    sceneId="58e02362287440d9a5bf3f8d6d6bfcf9"
                    {..._args}
                />
            </div>
        </ADT3DScenePageContext.Provider>
    );
};

export const WidgetsFormEditLink = Template.bind({});
WidgetsFormEditLink.play = async (context) => {
    await WidgetsListMore.play({ ...context, listItemIndex: 2 });
    // click the edit button in the overflow
    const editButton = await findOverflowMenuItem('editWidgetOverflow');
    await clickOverFlowMenuItem(editButton);
};

export const WidgetsFormCreateGaugeEmpty = Template.bind({});
WidgetsFormCreateGaugeEmpty.play = async (context) => {
    await WidgetsListAddDialogShow.play(context);
    // mock data does not have a gauge so we go through the flow to add one
    const gaugeButton = await findCalloutItemByTestId('widget-library-Gauge');
    await userEvent.click(gaugeButton);
    const addButton = await findCalloutItemByTestId(
        'widget-library-add-button'
    );
    await userEvent.click(addButton);
};

export const WidgetsFormEditGaugeValid = Template.bind({});
WidgetsFormEditGaugeValid.play = async (context) => {
    await WidgetsFormCreateGaugeEmpty.play(context);
    const canvas = within(context.canvasElement);
    const labelInput = await canvas.findByTestId(
        'widget-form-gauge-label-input'
    );
    await userEvent.type(labelInput, 'my widget');
    const unitsInput = await canvas.findByTestId(
        'widget-form-gauge-units-input'
    );
    await userEvent.type(unitsInput, 'F');

    await sleep(1);
    await selectDropDownMenuItem(canvas, 'widget-form-property-dropdown', 2);
};

export const WidgetsFormCreateGaugeSave = Template.bind({});
WidgetsFormCreateGaugeSave.play = async (context) => {
    await WidgetsFormEditGaugeValid.play(context);
    const canvas = within(context.canvasElement);
    const saveButton = await canvas.findByTestId('widget-form-primary-button');
    await userEvent.click(saveButton);
};

export const WidgetsFormCreateValueEmpty = Template.bind({});
WidgetsFormCreateValueEmpty.play = async (context) => {
    await WidgetsListAddDialogShow.play(context);
    const valueButton = await findCalloutItemByTestId('widget-library-Value');
    await userEvent.click(valueButton);
    const addButton = await findCalloutItemByTestId(
        'widget-library-add-button'
    );
    await userEvent.click(addButton);
};
