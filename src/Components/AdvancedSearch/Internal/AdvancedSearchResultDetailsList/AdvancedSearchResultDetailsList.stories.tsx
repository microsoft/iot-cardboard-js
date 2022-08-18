import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import AdvancedSearchResultDetailsList from './AdvancedSearchResultDetailsList';
import { IAdvancedSearchResultDetailsListProps } from './AdvancedSearchResultDetailsList.types';
import { IADTTwin } from '../../../../Models/Constants';
import twinData from '../../../../Adapters/__mockData__/MockAdapterData/DemoEnvsTwinData.json';
import useAuthParams from '../../../../../.storybook/useAuthParams';
import MockAdapter from '../../../../Adapters/MockAdapter';
const wrapperStyle = { width: '100%', height: '600px', padding: 8 };
const filteredTwins: IADTTwin[] = twinData;
const cols = ['FailedPickupsLastHr', 'HydraulicPressure', 'WindSpeed'];
export default {
    title: 'Components/AdvancedSearch/SearchResults',
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
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={wrapperStyle}>
            <AdvancedSearchResultDetailsList
                adapter={new MockAdapter()}
                {...args}
            />
        </div>
    );
};

export const Base = Template.bind({}) as AdvancedSearchResultDetailsListStory;
Base.args = {
    twins: filteredTwins,
    searchedProperties: cols
} as IAdvancedSearchResultDetailsListProps;
