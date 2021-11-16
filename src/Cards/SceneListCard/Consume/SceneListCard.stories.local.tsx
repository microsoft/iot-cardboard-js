import React from 'react';
import SceneListCard from './SceneListCard';
import ADTAdapter from '../../../Adapters/ADTAdapter';
import MsalAuthService from '../../../Models/Services/MsalAuthService';
import useAuthParams from '../../../../.storybook/useAuthParams';

export default {
    title: 'SceneListCard/Consume'
};

const sceneListCardStyle = {
    height: '100%'
};

export const SceneCard = (_args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={sceneListCardStyle}>
            <SceneListCard
                title={'Scene List Card'}
                theme={theme}
                locale={locale}
                adapter={
                    new ADTAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        )
                    )
                }
                editSceneListCardClick={(item, itemIndex) => {
                    console.log(`${item.$dtId} of ${itemIndex} is clicked!`);
                }}
                addNewSceneListCardClick={() => {
                    console.log('Add New button clicked!');
                }}
                deleteSceneListCardClick={() => {
                    console.log('Delete button clicked!');
                }}
            />
        </div>
    );
};
