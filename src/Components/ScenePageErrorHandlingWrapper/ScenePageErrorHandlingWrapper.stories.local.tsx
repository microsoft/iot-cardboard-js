import React from 'react';
import { useTranslation } from 'react-i18next';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADT3DSceneAdapter from '../../Adapters/ADT3DSceneAdapter';
import { ComponentErrorType } from '../../Models/Constants';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import ScenePageErrorHandlingWrapper from './ScenePageErrorHandlingWrapper';

const cardStyle = {
    height: '600px',
    width: 'unset'
};

export default {
    title: 'Components/ScenePageErrorHandlingWrapper',
    component: ScenePageErrorHandlingWrapper,
    decorators: [getDefaultStoryDecorator<any>(cardStyle)]
};

export const BlobNotFoundError = () => {
    const { t } = useTranslation();
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <ScenePageErrorHandlingWrapper
            adapter={
                new ADT3DSceneAdapter(
                    new MsalAuthService(
                        authenticationParameters.adt.aadParameters
                    ),
                    authenticationParameters.adt.hostUrl,
                    authenticationParameters.storage.blobContainerUrl
                )
            }
            errors={[
                {
                    type: ComponentErrorType.BlobNotFound,
                    isCatastrophic: true
                }
            ]}
            primaryClickAction={{
                buttonText: t('learnMore'),
                onClick: () => {
                    return window.alert('clicked');
                }
            }}
        />
    );
};

export const UnauthorizedAccessError = () => {
    const { t } = useTranslation();
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div>
            <ScenePageErrorHandlingWrapper
                adapter={
                    new ADT3DSceneAdapter(
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        ),
                        authenticationParameters.adt.hostUrl,
                        authenticationParameters.storage.blobContainerUrl
                    )
                }
                primaryClickAction={{
                    buttonText: t('learnMore'),
                    onClick: () => {
                        return window.alert('clicked');
                    }
                }}
                errors={[
                    {
                        type: ComponentErrorType.UnauthorizedAccess,
                        isCatastrophic: true
                    }
                ]}
            />
        </div>
    );
};

export const InternalServerError = () => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div>
            <ScenePageErrorHandlingWrapper
                adapter={
                    new ADT3DSceneAdapter(
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        ),
                        authenticationParameters.adt.hostUrl,
                        authenticationParameters.storage.blobContainerUrl
                    )
                }
                errors={[
                    {
                        type: ComponentErrorType.InternalServerError,
                        isCatastrophic: true
                    }
                ]}
            />
        </div>
    );
};
