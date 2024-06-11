import React from 'react';
import { ComponentStory } from '@storybook/react';
import ADT3DSceneBuilder from '../../../../../ADT3DSceneBuilder';
import {
    ADXConnectionInformationLoadingState,
    IADT3DScenePageContext,
    IADT3DScenePageState
} from '../../../../../../../Pages/ADT3DScenePage/ADT3DScenePage.types';
import { I3DScenesConfig } from '../../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import trucksMockVConfig from '../../../../../../../Adapters/__mockData__/TruckAndMachinesConfig.json';
import {
    clickOverFlowMenuItem,
    findCalloutItemByTestId,
    findOverflowMenuItem,
    IStoryContext
} from '../../../../../../../Models/Services/StoryUtilities';
import { IADT3DSceneBuilderCardProps } from '../../../../../ADT3DSceneBuilder.types';
import { ADT3DScenePageContext } from '../../../../../../../Pages/ADT3DScenePage/ADT3DScenePage';
import MockAdapter from '../../../../../../../Adapters/MockAdapter';
import { deepCopy } from '../../../../../../../Models/Services/Utils';
import { userEvent, within } from '@storybook/testing-library';
import {
    WidgetsListAddDialogShow,
    WidgetsListMore
} from '../../../../../ADT3DSceneBuilder.WidgetsList.stories';

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
            connection: {
                kustoClusterUrl:
                    'https://mockKustoClusterName.westus2.kusto.windows.net',
                kustoDatabaseName: 'mockKustoDatabaseName',
                kustoTableName: 'mockKustoTableName'
            },
            loadingState: ADXConnectionInformationLoadingState.EXIST
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

export const WidgetsFormCreateDataHistoryEmpty = Template.bind({});
WidgetsFormCreateDataHistoryEmpty.play = async (context) => {
    await WidgetsListAddDialogShow.play(context);
    const dataHistoryButton = await findCalloutItemByTestId(
        'widget-library-Data history'
    );
    await userEvent.click(dataHistoryButton);
    const addButton = await findCalloutItemByTestId(
        'widget-library-add-button'
    );
    await userEvent.click(addButton);
};

export const WidgetsFormEditDataHistory = Template.bind({});
WidgetsFormEditDataHistory.play = async (context) => {
    await WidgetsListMore.play({ ...context, listItemIndex: 4 });

    // click the edit button in the overflow
    const editButton = await findOverflowMenuItem('editWidgetOverflow');
    await clickOverFlowMenuItem(editButton);
};

export const WidgetsFormEditTimeSeriesInDataHistory = Template.bind({});
WidgetsFormEditTimeSeriesInDataHistory.play = async (context) => {
    await WidgetsFormEditDataHistory.play(context);

    // click on the first list item in time series list
    const canvas = within(context.canvasElement);
    const timeSeriesListItem1 = await canvas.findByTestId(
        'cardboard-list-item-time-series-in-data-history-widget-0'
    );
    userEvent.click(timeSeriesListItem1);
};
