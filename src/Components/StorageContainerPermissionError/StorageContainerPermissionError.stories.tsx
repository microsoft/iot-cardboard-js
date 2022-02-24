import React from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import StorageContainerPermissionError from './StorageContainerPermissionError';
import { ComponentErrorType } from '../../Models/Constants';

export default {
    title: 'Components/StorageContainerPermissionError',
    component: StorageContainerPermissionError
};

export const UnauthorizedAccessError = () => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <StorageContainerPermissionError
            errorTitle="BlobStorageError"
            errorType={ComponentErrorType.UnauthorizedAccess}
        />
    );
};

export const NonExistentBlob = () => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div>
            <StorageContainerPermissionError
                errorTitle="BlobStorageError"
                errorType={ComponentErrorType.NonExistentBlob}
            />
        </div>
    );
};
