import React from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import { ComponentErrorType } from '../../Models/Constants';
import ScenePageError from './ScenePageError';

export default {
    title: 'Components/ScenePageError',
    component: ScenePageError
};

export const UnauthorizedAccessError = () => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <ScenePageError
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
            <ScenePageError
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
            <ScenePageError
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
