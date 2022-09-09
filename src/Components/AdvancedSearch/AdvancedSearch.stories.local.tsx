import React from 'react';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import useAuthParams from '../../../.storybook/useAuthParams';
import AdvancedSearch from './AdvancedSearch';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import { IAdvancedSearchProps } from './AdvancedSearch.types';
import { ComponentStory } from '@storybook/react';
import { ADTAdapter } from '../../Adapters';
import { queryAllowedPropertyValueTypes } from './Internal/QueryBuilder/QueryBuilder.types';

const wrapperStyle = { width: '100%', height: '100vh', padding: 8 };

export default {
    title: 'Components/AdvancedSearch',
    component: AdvancedSearch,
    decorators: [getDefaultStoryDecorator<IAdvancedSearchProps>(wrapperStyle)]
};

type AdvancedSearchStory = ComponentStory<typeof AdvancedSearch>;

const Template: AdvancedSearchStory = (_args) => {
    const authenticationParameters = useAuthParams();

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <AdvancedSearch
            adapter={
                new ADTAdapter(
                    authenticationParameters.adt.hostUrl,
                    new MsalAuthService(
                        authenticationParameters.adt.aadParameters
                    ),
                    authenticationParameters.storage.blobContainerUrl
                )
            }
            allowedPropertyValueTypes={queryAllowedPropertyValueTypes}
            isOpen={true}
            onDismiss={() => ({})}
        />
    );
};

export const LiveAdvancedSearchModal = Template.bind({});
LiveAdvancedSearchModal.storyName = 'Twin Advanced search';
