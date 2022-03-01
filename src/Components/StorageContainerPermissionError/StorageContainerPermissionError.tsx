import React from 'react';
import { ComponentErrorType } from '../../Models/Constants';
import './StorageContainerPermissionError.scss';
import { Image, MessageBar, MessageBarType } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import BaseComponent from '../BaseComponent/BaseComponent';
import { StorageContainerPermissionErrorProps } from './StorageContainerPermissionError.types';
import Error from '../../Resources/Static/error.svg';
const StorageContainerPermissionError: React.FC<StorageContainerPermissionErrorProps> = ({
    errorType
}) => {
    const { t } = useTranslation();
    let componentContent;
    switch (errorType) {
        case ComponentErrorType.NonExistentBlob:
            componentContent = (
                <div
                    className="cb-scene-nonexistent-blob-error-wrapper"
                    style={{ display: 'flex', flexDirection: 'column' }}
                >
                    <Image shouldStartVisible={true} src={Error} height={100} />
                    <h2>{'Blob Error'}</h2>
                    <h4>{'Blob does now exist'}</h4>
                </div>
            );
            break;
        case ComponentErrorType.UnauthorizedAccess:
            componentContent = (
                <div
                    className="cb-scene-nonexistent-blob-error-wrapper"
                    style={{ display: 'flex', flexDirection: 'column' }}
                >
                    <Image shouldStartVisible={true} src={Error} height={100} />
                    <h2>{'Access Restricted'}</h2>
                    <h4>
                        {
                            'You do not have access to this blob. Request Reader access or try a different blob'
                        }
                    </h4>
                </div>
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
