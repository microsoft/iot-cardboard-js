import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import AdvancedSearchResultDetailsList from './AdvancedSearchResultDetailsList';
import { IAdvancedSearchResultDetailsListProps } from './AdvancedSearchResultDetailsList.types';
import { IADTTwin } from '../../Models/Constants';

import twinData from '../../Adapters/__mockData__/MockAdapterData/DemoEnvsTwinData.json';
//'.../Adapters\__mockData__\MockAdapterData\DemoEnvsTwinData.json'
const wrapperStyle = { width: '100%', height: '600px', padding: 8 };
const filteredTwins: IADTTwin[] = twinData;

const cols = [
    {
        key: `FailedPickupsLastHr + ${Math.random()}`,
        name: 'Failed Pickups Last Hr',
        fieldName: 'FailedPickupsLastHr',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true
    },
    {
        key: `HydraulicPressure + ${Math.random()}`,
        name: 'Hydraulic Pressure',
        fieldName: 'HydraulicPressure',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true
    }
];
export default {
    title: 'Components/AdvancedSearchResultDetailsList',
    component: AdvancedSearchResultDetailsList,
    decorators: [
        getDefaultStoryDecorator<IAdvancedSearchResultDetailsListProps>(
            wrapperStyle
        )
    ]
};

type AdvancedSearchResultDetailsListStory = ComponentStory<
    typeof AdvancedSearchResultDetailsList
>;

const Template: AdvancedSearchResultDetailsListStory = (args) => {
    return <AdvancedSearchResultDetailsList {...args} />;
};

export const Base = Template.bind({}) as AdvancedSearchResultDetailsListStory;
Base.args = {
    filteredTwinsResult: filteredTwins,
    additionalColumns: cols
} as IAdvancedSearchResultDetailsListProps;
