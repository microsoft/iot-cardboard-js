import React from 'react';
import { ComponentErrorType } from '../../Models/Constants';
import './ScenePageErrorHandlingWrapper.scss';
import { MessageBar, MessageBarType } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import BaseComponent from '../BaseComponent/BaseComponent';
import { ScenePageErrorHandlingWrapperProps } from './ScenePageErrorHandlingWrapper.types';
import { ErrorImages } from '../../Models/Constants';
import ErrorIllustration from '../ErrorIllustration/ErrorIllustration';
const ScenePageErrorHandlingWrapper: React.FC<ScenePageErrorHandlingWrapperProps> = ({
    errors,
    children
}) => {
    const { t } = useTranslation();
    let componentContent;
    switch (errors?.[0]?.type) {
        case ComponentErrorType.NonExistentBlob:
            componentContent = (
                <ErrorIllustration
                    imageName={ErrorImages.BlobError}
                    errorTitle={t('nonExistentBlobErrorTitle')}
                    errorMessage={t('nonExistentBlobErrorMessage')}
                    buttonText={t('tryAgain')}
                ></ErrorIllustration>
            );
            break;
        case ComponentErrorType.UnauthorizedAccess:
            componentContent = (
                <ErrorIllustration
                    imageName={ErrorImages.AccessRestricted}
                    errorTitle={t('unauthorizedAccessErrorTitle')}
                    errorMessage={t('unauthorizedAccessErrorMessage')}
                    buttonText={t('tryAgain')}
                ></ErrorIllustration>
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
                    {t('readerAccessOnlyErrorMessage')}
                </MessageBar>
            );
            break;
        default:
            componentContent = children;
    }
    return (
        <BaseComponent containerClassName="cb-scene-page-container">
            {componentContent}
        </BaseComponent>
    );
};

export default React.memo(ScenePageErrorHandlingWrapper);
