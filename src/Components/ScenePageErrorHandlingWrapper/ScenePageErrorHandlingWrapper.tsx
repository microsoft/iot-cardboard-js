import React from 'react';
import { ComponentErrorType } from '../../Models/Constants';
import './ScenePageErrorHandlingWrapper.scss';
import { MessageBar, MessageBarType } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import BaseComponent from '../BaseComponent/BaseComponent';
import { ScenePageErrorHandlingWrapperProps } from './ScenePageErrorHandlingWrapper.types';
import { ErrorImages } from '../../Models/Constants';
import ErrorIllustration from './Internal/ErrorIllustration/ErrorIllustration';
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
        case ComponentErrorType.JsonSchemaError:
            // TODO SCHEMA MIGRATION -- update json schema error UI to clearly show error information
            componentContent = (
                <ErrorIllustration
                    imageName={ErrorImages.BlobError}
                    errorTitle={'JSON schema validation failed'}
                    errorMessage={errors[0].jsonSchemaErrors
                        .map((schemaError) =>
                            JSON.stringify(schemaError, null, 2)
                        )
                        .join('\n\n')}
                    buttonText={t('tryAgain')}
                ></ErrorIllustration>
            );
            break;
        default:
            componentContent = children;
    }
    return <BaseComponent>{componentContent}</BaseComponent>;
};

export default React.memo(ScenePageErrorHandlingWrapper);
