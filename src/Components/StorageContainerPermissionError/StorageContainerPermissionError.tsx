import React from 'react';
import { ComponentErrorType } from '../../Models/Constants';
import './StorageContainerPermissionError.scss';
import {
    ImageFit,
    Image,
    MessageBar,
    MessageBarType,
    IImageProps
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import BaseComponent from '../BaseComponent/BaseComponent';
import { StorageContainerPermissionErrorProps } from './StorageContainerPermissionError.types';
import Error from '../../Resources/Static/error.svg';
import AccessRestrictedError from '../../Resources/Static/accessRestricted.svg';
const StorageContainerPermissionError: React.FC<StorageContainerPermissionErrorProps> = ({
    errors,
    children
}) => {
    const { t } = useTranslation();
    const imageProps: IImageProps = {
        imageFit: ImageFit.centerCover,
        height: 300
    };

    let componentContent;
    switch (errors?.[0]?.type) {
        case ComponentErrorType.NonExistentBlob:
            componentContent = (
                <div
                    className="cb-scene-nonexistent-blob-error-wrapper"
                    style={{ display: 'flex', flexDirection: 'column' }}
                >
                    <Image
                        className="cb-scene-nonexistant-blob-error-image"
                        shouldStartVisible={true}
                        src={Error}
                        {...imageProps}
                    />
                    <p className="cb-error-title">
                        {t('NonExistentBlobErrorTitle')}
                    </p>
                    <p className="cb-error-message">
                        {t('NonExistentBlobErrorMessage')}
                    </p>
                </div>
            );
            break;
        case ComponentErrorType.UnauthorizedAccess:
            componentContent = (
                <div
                    className="cb-scene-unauthorized-blob-error-wrapper"
                    style={{ display: 'flex', flexDirection: 'column' }}
                >
                    <Image
                        className="cb-scene-nonexistant-blob-error-image"
                        shouldStartVisible={true}
                        src={AccessRestrictedError}
                        {...imageProps}
                    />
                    <p className="error-title">
                        {t('UnauthorizedAccessErrorTitle')}
                    </p>
                    <p className="error-message">
                        {t('UnauthorizedAccessErrorMessage')}
                    </p>
                </div>
            );
            break;
        case ComponentErrorType.ReaderAccessOnly:
            componentContent = (
                <MessageBar
                    messageBarType={MessageBarType.warning}
                    isMultiline={false}
                    onDismiss={null}
                    dismissButtonAriaLabel={t('close')}
                    className="cb-scene-page-warning-message"
                >
                    {t('ReaderAccessOnlyErrorMessage')}
                </MessageBar>
            );
            break;
        default:
            componentContent = children;
    }
    return (
        <BaseComponent containerClassName="cb-message-bar-container">
            {componentContent}
        </BaseComponent>
    );
};

export default React.memo(StorageContainerPermissionError);
