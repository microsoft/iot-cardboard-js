import React from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import StorageContainerPermissionError from './StorageContainerPermissionError';
import { ComponentErrorType } from '../../Models/Constants';

export default {
    title: 'Components/StorageContainerPermissionError'
}

export const UnauthorizedAccessError = () => {
    //debugger;
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
            <StorageContainerPermissionError
                errorTitle='BlobStorageError'
                error={
                    ComponentErrorType.UnAuthorizedAccess
                }
            />
       
    );
};

export const NonExistentBlob = () => {
    //debugger;
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div>
            <StorageContainerPermissionError
                errorTitle='BlobStorageError'
                error={
                    ComponentErrorType.NonExistentBlob
                }
            />
       </div>
    );
};
