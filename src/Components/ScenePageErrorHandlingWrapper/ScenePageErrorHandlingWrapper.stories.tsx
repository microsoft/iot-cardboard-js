import React from 'react';
import { useTranslation } from 'react-i18next';
import useAuthParams from '../../../.storybook/useAuthParams';
import { ComponentErrorType } from '../../Models/Constants';
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

export const NonExistentBlob = () => {
    const { t } = useTranslation();
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <ScenePageErrorHandlingWrapper
            errors={[
                {
                    type: ComponentErrorType.NonExistentBlob,
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

export const ReaderAccessOnly = () => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div>
            <ScenePageErrorHandlingWrapper
                errors={[
                    {
                        type: ComponentErrorType.ReaderAccessOnly,
                        isCatastrophic: true
                    }
                ]}
            />
        </div>
    );
};
