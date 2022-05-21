import React from 'react';
import { ComponentErrorType } from '../../Models/Constants';
import './ScenePageErrorHandlingWrapper.scss';
import { MessageBar, MessageBarType } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import BaseComponent from '../BaseComponent/BaseComponent';
import { ScenePageErrorHandlingWrapperProps } from './ScenePageErrorHandlingWrapper.types';
import IllustrationMessage from '../IllustrationMessage/IllustrationMessage';
import BlobError from '../../Resources/Static/error.svg';
import PriviledgedAccess from '../../Resources/Static/priviledgedAccess.svg';

const ScenePageErrorHandlingWrapper: React.FC<ScenePageErrorHandlingWrapperProps> = ({
    errors,
    primaryClickAction,
    children
}) => {
    const { t } = useTranslation();
    let componentContent;
    switch (errors?.[0]?.type) {
        case ComponentErrorType.NonExistentBlob:
            componentContent = (
                <IllustrationMessage
                    headerText={t('nonExistentBlobErrorTitle')}
                    descriptionText={t('nonExistentBlobErrorMessage')}
                    type={'error'}
                    width={'wide'}
                    imageProps={{
                        src: BlobError,
                        height: 200
                    }}
                    buttonProps={{
                        onClick: primaryClickAction.onClick,
                        text: primaryClickAction.buttonText
                    }}
                />
            );
            break;
        case ComponentErrorType.UnauthorizedAccess:
            componentContent = (
                <IllustrationMessage
                    headerText={t('unauthorizedAccessErrorTitle')}
                    descriptionText={t('unauthorizedAccessErrorMessage')}
                    type={'error'}
                    width={'wide'}
                    imageProps={{
                        src: PriviledgedAccess,
                        height: 200
                    }}
                    buttonProps={{
                        onClick: primaryClickAction.onClick,
                        text: primaryClickAction.buttonText
                    }}
                />
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
                <IllustrationMessage
                    headerText={'JSON schema validation failed'}
                    descriptionText={errors[0].jsonSchemaErrors
                        .map((schemaError) =>
                            JSON.stringify(schemaError, null, 2)
                        )
                        .join('\n\n')}
                    type={'error'}
                    width={'wide'}
                    imageProps={{
                        src: BlobError,
                        height: 200
                    }}
                    buttonProps={{
                        onClick: primaryClickAction.onClick,
                        text: primaryClickAction.buttonText
                    }}
                />
            );
            break;
        case ComponentErrorType.NoContainerUrl:
            componentContent = (
                <IllustrationMessage
                    headerText={t('noContainerUrlErrorTitle')}
                    descriptionText={t('noContainerUrlErrorMessage')}
                    type={'error'}
                    width={'wide'}
                    imageProps={{
                        src: BlobError,
                        height: 200
                    }}
                    buttonProps={{
                        onClick: primaryClickAction.onClick,
                        text: primaryClickAction.buttonText
                    }}
                />
            );
            break;
        case ComponentErrorType.NoADTInstanceUrl:
            componentContent = (
                <IllustrationMessage
                    headerText={t('noADTInstanceUrlTitle')}
                    descriptionText={t('noADTInstanceUrlMessage')}
                    type={'error'}
                    width={'wide'}
                    imageProps={{
                        src: BlobError,
                        height: 200
                    }}
                    buttonProps={{
                        onClick: primaryClickAction.onClick,
                        text: primaryClickAction.buttonText
                    }}
                />
            );
            break;
        default:
            componentContent = children;
    }
    return <BaseComponent>{componentContent}</BaseComponent>;
};

export default React.memo(ScenePageErrorHandlingWrapper);
