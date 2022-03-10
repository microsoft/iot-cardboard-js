import React from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import { ComponentErrorType } from '../../Models/Constants';
import ScenePageErrorHandlingWrapper from './ScenePageErrorHandlingWrapper';

export default {
    title: 'Components/ScenePageErrorHandlingWrapper',
    component: ScenePageErrorHandlingWrapper
};

export const UnauthorizedAccessError = () => {
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
        />
    );
};

export const NonExistentBlob = () => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div>
            <ScenePageErrorHandlingWrapper
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
