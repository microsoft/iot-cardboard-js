import React from 'react';
import { ComponentErrorType } from '../../Models/Constants';
import './StorageContainerPermissionError.scss';
import { IImageProps, MessageBar, MessageBarType } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import BaseComponent from '../BaseComponent/BaseComponent';
import { StorageContainerPermissionErrorProps } from './StorageContainerPermissionError.types';
import ScenePageErrorSplash from '../ScenePageErrorSplash/ScenePageErrorSplash';
const StorageContainerPermissionError: React.FC<StorageContainerPermissionErrorProps> = ({
    errorType
}) => {
    const { t } = useTranslation();
    const imageProps: Partial<IImageProps> = {};
    let componentContent;
    switch (errorType) {
        case ComponentErrorType.NonExistentBlob:
            componentContent = (
                <ScenePageErrorSplash
                    image={imageProps}
                    errorHeader="Blob Error"
                    errorMessage="Blob does now exist"
                    //buttonLabel="Change storage container"
                />
            );
            break;
        case ComponentErrorType.UnauthorizedAccess:
            // imageProps.src = require('');
            componentContent = (
                <ScenePageErrorSplash
                    image={imageProps}
                    errorHeader="Access Restricted"
                    errorMessage="You do not have access to this blob. Request Reader access or try a different blob"
                />
            );
            break;
        default:
            componentContent = (
                <MessageBar
                    messageBarType={MessageBarType.warning}
                    isMultiline={false}
                    onDismiss={null}
                    dismissButtonAriaLabel={t('close')}
                    className="cb-scene-page-warning-message"
                >
                    {t(errorType)}
                </MessageBar>
            );
    }
    return (
        <BaseComponent containerClassName="cb-message-bar-container">
            {componentContent}
        </BaseComponent>
    );
};

export default React.memo(StorageContainerPermissionError);
