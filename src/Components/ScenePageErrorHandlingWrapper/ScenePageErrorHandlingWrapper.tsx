import React, { useMemo } from 'react';
import { ComponentErrorType } from '../../Models/Constants';
import { MessageBar, MessageBarType } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import BaseComponent from '../BaseComponent/BaseComponent';
import { ScenePageErrorHandlingWrapperProps } from './ScenePageErrorHandlingWrapper.types';
import IllustrationMessage from '../IllustrationMessage/IllustrationMessage';
import BlobErrorImg from '../../Resources/Static/error.svg';
import PriviledgedAccessImg from '../../Resources/Static/priviledgedAccess.svg';
import DefaultErrorImg from '../../Resources/Static/noResults.svg';
import CorsErrorImg from '../../Resources/Static/corsError.svg';
import { getScenePageErrorHandlingStyles } from './ScenePageErrorHandlingWrapper.styles';
import UnauthorizedAccessHandling from './Internal/UnauthorizedAccessHandling';

const ScenePageErrorHandlingWrapper: React.FC<ScenePageErrorHandlingWrapperProps> = ({
    adapter,
    errors,
    primaryClickAction,
    verifyCallbackAdapterData
}) => {
    const { t } = useTranslation();

    const styles = getScenePageErrorHandlingStyles();
    const errorContent = useMemo(() => {
        let content;
        switch (errors?.[0]?.type) {
            case ComponentErrorType.BlobNotFound:
                content = (
                    <IllustrationMessage
                        headerText={t(
                            'scenePageErrorHandling.blobNotFoundErrorTitle'
                        )}
                        descriptionText={t(
                            'scenePageErrorHandling.blobNotFoundErrorMessage'
                        )}
                        type={'error'}
                        width={'wide'}
                        imageProps={{
                            src: BlobErrorImg,
                            height: 200
                        }}
                        buttonProps={{
                            onClick: primaryClickAction.onClick,
                            text: primaryClickAction.buttonText
                        }}
                    />
                );
                break;
            case ComponentErrorType.SetCorsPropertiesNotAuthorized: // currently this specific type or error is handled only for blob service responses and handled differently by an internal component as multiple steps required to resolve
                content = (
                    <IllustrationMessage
                        headerText={t(
                            'scenePageErrorHandling.unauthorizedAccessErrorTitle'
                        )}
                        descriptionText={t(
                            'scenePageErrorHandling.setCorsPropertiesNotAuthorizedMessage'
                        )}
                        type={'error'}
                        width={'wide'}
                        imageProps={{
                            src: PriviledgedAccessImg,
                            height: 200
                        }}
                        buttonProps={{
                            onClick: primaryClickAction.onClick,
                            text: primaryClickAction.buttonText
                        }}
                        styles={{ container: { height: 'auto', flexGrow: 1 } }}
                    />
                );
                break;
            case ComponentErrorType.UnauthorizedAccess: // currently this specific type or error is handled only for blob service responses and handled differently by an internal component as multiple steps required to resolve
                content = (
                    <UnauthorizedAccessHandling
                        adapter={adapter}
                        errors={errors}
                        verifyCallbackAdapterData={verifyCallbackAdapterData}
                    />
                );
                break;
            case ComponentErrorType.InternalServerError:
                content = (
                    <MessageBar
                        messageBarType={MessageBarType.warning}
                        isMultiline={false}
                        onDismiss={null}
                        dismissButtonAriaLabel={t('close')}
                        className={styles.warningMessage}
                    >
                        {t('scenePageErrorHandling.internalServerErrorMessage')}
                    </MessageBar>
                );
                break;
            case ComponentErrorType.JsonSchemaError:
                // TODO SCHEMA MIGRATION -- update json schema error UI to clearly show error information
                content = (
                    <IllustrationMessage
                        headerText={t('errors.schemaValidationFailed.type')}
                        descriptionText={errors[0].jsonSchemaErrors
                            .map((schemaError) =>
                                JSON.stringify(schemaError, null, 2)
                            )
                            .join('\n\n')}
                        type={'error'}
                        width={'wide'}
                        imageProps={{
                            src: BlobErrorImg,
                            height: 200
                        }}
                        buttonProps={{
                            onClick: primaryClickAction.onClick,
                            text: primaryClickAction.buttonText
                        }}
                    />
                );
                break;
            case ComponentErrorType.CORSError:
                content = (
                    <IllustrationMessage
                        headerText={
                            errors?.[0]?.isCatastrophic
                                ? t('scenePageErrorHandling.corsErrorTitle')
                                : t(
                                      'scenePageErrorHandling.partialCorsErrorTitle'
                                  )
                        }
                        descriptionText={
                            errors?.[0]?.isCatastrophic
                                ? t('scenePageErrorHandling.corsErrorMessage')
                                : t(
                                      'scenePageErrorHandling.partialCorsErrorMessage'
                                  )
                        }
                        type={'error'}
                        width={'wide'}
                        imageProps={{
                            src: CorsErrorImg,
                            height: 200
                        }}
                        buttonProps={{
                            onClick: primaryClickAction.onClick,
                            text: primaryClickAction.buttonText
                        }}
                        styles={{ container: { height: 'auto', flexGrow: 1 } }}
                    />
                );
                break;
            case ComponentErrorType.UnknownError:
                content = (
                    <IllustrationMessage
                        headerText={t(
                            'scenePageErrorHandling.unknownErrorTitle'
                        )}
                        descriptionText={errors?.[0]?.message}
                        type={'error'}
                        width={'wide'}
                        imageProps={{
                            src: PriviledgedAccessImg,
                            height: 200
                        }}
                        buttonProps={{
                            onClick: primaryClickAction.onClick,
                            text: primaryClickAction.buttonText
                        }}
                        styles={{ container: { height: 'auto', flexGrow: 1 } }}
                    />
                );
                break;
            case ComponentErrorType.NoContainerUrl:
                content = (
                    <IllustrationMessage
                        headerText={t(
                            'scenePageErrorHandling.noContainerUrlErrorTitle'
                        )}
                        descriptionText={t(
                            'scenePageErrorHandling.noContainerUrlErrorMessage'
                        )}
                        type={'error'}
                        width={'wide'}
                        imageProps={{
                            src: BlobErrorImg,
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
                content = (
                    <IllustrationMessage
                        headerText={t(
                            'scenePageErrorHandling.noADTInstanceUrlTitle'
                        )}
                        descriptionText={t(
                            'scenePageErrorHandling.noADTInstanceUrlMessage'
                        )}
                        type={'error'}
                        width={'wide'}
                        imageProps={{
                            src: BlobErrorImg,
                            height: 200
                        }}
                        buttonProps={{
                            onClick: primaryClickAction.onClick,
                            text: primaryClickAction.buttonText
                        }}
                    />
                );
                break;
            case ComponentErrorType.ConnectionError:
                content = (
                    <IllustrationMessage
                        headerText={t(
                            'scenePageErrorHandling.networkErrorTitle'
                        )}
                        descriptionText={t(
                            'scenePageErrorHandling.networkErrorMessage'
                        )}
                        type={'error'}
                        width={'wide'}
                        imageProps={{
                            src: CorsErrorImg,
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
                content = (
                    <IllustrationMessage
                        headerText={errors?.[0]?.name}
                        descriptionText={
                            errors?.[0]?.rawError?.message ??
                            errors?.[0]?.message
                        }
                        type={'error'}
                        width={'wide'}
                        imageProps={{
                            src: DefaultErrorImg,
                            height: 200
                        }}
                        buttonProps={{
                            onClick: primaryClickAction.onClick,
                            text: primaryClickAction.buttonText
                        }}
                        styles={{ container: { height: 'auto', flexGrow: 1 } }}
                    />
                );
        }
        return content;
    }, [errors, primaryClickAction]);

    return (
        <BaseComponent>
            <div className={styles.root}>{errorContent}</div>
        </BaseComponent>
    );
};

export default React.memo(ScenePageErrorHandlingWrapper);
