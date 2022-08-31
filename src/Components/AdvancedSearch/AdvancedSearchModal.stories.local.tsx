import React from 'react';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import useAuthParams from '../../../.storybook/useAuthParams';
import AdvancedSearchModal from './AdvancedSearchModal';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import { IAdvancedSearchProps } from './AdvancedSearch.types';
import { ComponentStory } from '@storybook/react';
import { ADTAdapter } from '../../Adapters';

const wrapperStyle = { width: '100%', height: '100vh', padding: 8 };

export default {
    title: 'Components/AdvancedSearch',
    component: AdvancedSearchModal,
    decorators: [getDefaultStoryDecorator<IAdvancedSearchProps>(wrapperStyle)]
};

type AdvancedSearchModalStory = ComponentStory<typeof AdvancedSearchModal>;

const Template: AdvancedSearchModalStory = (_args) => {
    const authenticationParameters = useAuthParams();

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <AdvancedSearchModal
            adapter={
                new ADTAdapter(
                    authenticationParameters.adt.hostUrl,
                    new MsalAuthService(
                        authenticationParameters.adt.aadParameters
                    ),
                    authenticationParameters.storage.blobContainerUrl
                )
            }
            allowedPropertyValueTypes={[
                'string',
                'boolean',
                'float',
                'integer',
                'double',
                'long'
            ]}
            isOpen={true}
            onDismiss={() => ({})}
            theme={null}
        />
    );
};

export const LiveAdvancedSearchModal = Template.bind({});
LiveAdvancedSearchModal.storyName = 'Twin Advanced search';
