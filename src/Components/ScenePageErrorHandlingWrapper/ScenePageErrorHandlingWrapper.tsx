import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import {
    AzureAccessPermissionRoles,
    ComponentErrorType,
    MissingAzureRoleDefinitionAssignments,
    ScenePageErrorHandlingMode
} from '../../Models/Constants';
import {
    MessageBar,
    MessageBarType,
    Spinner,
    SpinnerSize,
    useTheme
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import BaseComponent from '../BaseComponent/BaseComponent';
import { ScenePageErrorHandlingWrapperProps } from './ScenePageErrorHandlingWrapper.types';
import IllustrationMessage from '../IllustrationMessage/IllustrationMessage';
import BlobErrorImg from '../../Resources/Static/error.svg';
import PriviledgedAccessImg from '../../Resources/Static/priviledgedAccess.svg';
import DefaultErrorImg from '../../Resources/Static/noResults.svg';
import CorsErrorImg from '../../Resources/Static/corsError.svg';
import useAdapter from '../../Models/Hooks/useAdapter';
import { getScenePageErrorHandlingStyles } from './ScenePageErrorHandlingWrapper.styles';

const ScenePageErrorHandlingWrapper: React.FC<ScenePageErrorHandlingWrapperProps> = ({
    adapter,
    errors,
    primaryClickAction,
    reloadPageAdapterData
}) => {
    const { t } = useTranslation();
    const [mode, setMode] = useState(ScenePageErrorHandlingMode.Idle);
    const [
        missingPermissions,
        setMissingPermissions
    ] = useState<MissingAzureRoleDefinitionAssignments>(null);
    const [internalPrimaryButtonText, setInternalPrimaryButtonText] = useState(
        ''
    );
    const reloadPageTimeoutRef = useRef(null);

    const checkAccessOnContainerAdapterData = useAdapter({
        adapterMethod: () => adapter.getMissingStorageContainerAccessRoles(),
        refetchDependencies: [adapter, errors],
        isAdapterCalledOnMount: false
    });

    const addMissingRolesToContainerAdapterData = useAdapter({
        adapterMethod: (params: {
            permissionsToAdd: MissingAzureRoleDefinitionAssignments;
        }) =>
            adapter.addMissingRolesToStorageContainer(params.permissionsToAdd),
        refetchDependencies: [adapter, errors],
        isAdapterCalledOnMount: false
    });

    const onInternalPrimaryActionButtonClick = useCallback(async () => {
        {
            if (mode === ScenePageErrorHandlingMode.Idle) {
                setMode(ScenePageErrorHandlingMode.CheckingIssues);
                checkAccessOnContainerAdapterData.callAdapter();
            } else if (mode === ScenePageErrorHandlingMode.DiagnosedIssues) {
                setMode(ScenePageErrorHandlingMode.ResolvingIssues);
                addMissingRolesToContainerAdapterData.callAdapter({
                    permissionsToAdd: missingPermissions
                });
            } else if (
                mode === ScenePageErrorHandlingMode.FinishedWithSuccess
            ) {
                reloadPageAdapterData.callAdapter();
            } else if (
                mode === ScenePageErrorHandlingMode.FinishedWithFailure
            ) {
                window.open('https://docs.microsoft.com/azure/digital-twins/');
            }
        }
    }, [mode, missingPermissions]);

    useEffect(() => {
        if (mode === ScenePageErrorHandlingMode.Idle) {
            setInternalPrimaryButtonText(
                t('scenePageErrorHandling.diagnoseAccessPermissions')
            );
        } else if (mode === ScenePageErrorHandlingMode.DiagnosedIssues) {
            setInternalPrimaryButtonText(
                t('scenePageErrorHandling.resolveIssues')
            );
        } else if (mode === ScenePageErrorHandlingMode.FinishedWithSuccess) {
            reloadPageAdapterData.isLoading
                ? setInternalPrimaryButtonText(t('refreshing'))
                : setInternalPrimaryButtonText(t('refreshPage'));
        } else if (mode === ScenePageErrorHandlingMode.FinishedWithFailure) {
            setInternalPrimaryButtonText(t('learnMore'));
        }
    }, [mode, reloadPageAdapterData?.isLoading]);

    useEffect(() => {
        const missingPermissionData = checkAccessOnContainerAdapterData.adapterResult.getData();
        if (missingPermissionData) {
            if (
                missingPermissionData.enforced === null &&
                missingPermissionData.alternated === null
            ) {
                setMissingPermissions(null);
                setMode(ScenePageErrorHandlingMode.FinishedWithFailure);
            } else if (
                missingPermissionData.enforced.length === 0 &&
                missingPermissionData.alternated.length === 0
            ) {
                setMissingPermissions(null);
                setMode(ScenePageErrorHandlingMode.FinishedWithSuccess);
                reloadPageTimeoutRef.current = setInterval(() => {
                    reloadPageAdapterData.callAdapter();
                }, 15000);
            } else {
                setMissingPermissions(missingPermissionData);
                setMode(ScenePageErrorHandlingMode.DiagnosedIssues);
            }
        }
        return () => clearInterval(reloadPageTimeoutRef.current);
    }, [checkAccessOnContainerAdapterData?.adapterResult.result]);

    useEffect(() => {
        const assignedRolesData = addMissingRolesToContainerAdapterData.adapterResult.getData();
        if (assignedRolesData) {
            setMissingPermissions(null);
            setMode(ScenePageErrorHandlingMode.FinishedWithSuccess);
            reloadPageTimeoutRef.current = setInterval(() => {
                reloadPageAdapterData.callAdapter();
            }, 15000);
        }
        return () => clearInterval(reloadPageTimeoutRef.current);
    }, [addMissingRolesToContainerAdapterData?.adapterResult.result]);

    const theme = useTheme();
    const styles = getScenePageErrorHandlingStyles(theme);
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
            case ComponentErrorType.UnauthorizedAccess: // this specific type or error is handled differently by this component as multiple steps required to resolve
                content = (
                    <IllustrationMessage
                        key={errors?.[0]?.type}
                        headerText={t(
                            'scenePageErrorHandling.unauthorizedAccessErrorTitle'
                        )}
                        descriptionText={t(
                            'scenePageErrorHandling.unauthorizedAccessErrorMessage'
                        )}
                        linkProps={{
                            target: '_blank',
                            underline: true,
                            href:
                                'https://docs.microsoft.com/en-us/azure/storage/blobs/assign-azure-role-data-access?tabs=portal#assign-an-azure-role' // TODO: move this to Constants file along with other links
                        }}
                        linkText={t('learnMore')}
                        type={'error'}
                        width={'wide'}
                        imageProps={{
                            src: PriviledgedAccessImg,
                            height: 200
                        }}
                        {...(mode !==
                            ScenePageErrorHandlingMode.CheckingIssues &&
                            mode !==
                                ScenePageErrorHandlingMode.ResolvingIssues && {
                                buttonProps: {
                                    onClick: onInternalPrimaryActionButtonClick,
                                    text: internalPrimaryButtonText
                                }
                            })}
                        styles={{ container: { height: 'auto', flexGrow: 1 } }}
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
                        headerText={t('scenePageErrorHandling.corsErrorTitle')}
                        descriptionText={t(
                            'scenePageErrorHandling.corsErrorMessage'
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
    }, [
        errors,
        mode,
        internalPrimaryButtonText,
        onInternalPrimaryActionButtonClick
    ]);

    const progressContent = useMemo(() => {
        let content;
        switch (mode) {
            case ScenePageErrorHandlingMode.CheckingIssues:
                content = (
                    <Spinner
                        size={SpinnerSize.large}
                        label={t('scenePageErrorHandling.checkingPermissions')}
                    />
                );
                break;
            case ScenePageErrorHandlingMode.DiagnosedIssues:
                content = missingPermissions ? (
                    <>
                        <span>
                            {t('scenePageErrorHandling.missingPermissions')}:
                        </span>
                        <ul className={styles.list}>
                            {missingPermissions?.enforced?.map(
                                (permission, idx) => (
                                    <li
                                        key={`cb-missing-permissions-enforced-list-item-${idx}`}
                                    >
                                        {
                                            Object.keys(
                                                AzureAccessPermissionRoles
                                            )[
                                                Object.values(
                                                    AzureAccessPermissionRoles
                                                ).indexOf(permission)
                                            ]
                                        }
                                    </li>
                                )
                            )}

                            <li
                                key={
                                    'cb-missing-permissions-alternated-list-item'
                                }
                            >
                                {missingPermissions?.alternated?.map(
                                    (permission, idx) => (
                                        <>
                                            {
                                                Object.keys(
                                                    AzureAccessPermissionRoles
                                                )[
                                                    Object.values(
                                                        AzureAccessPermissionRoles
                                                    ).indexOf(permission)
                                                ]
                                            }
                                            {idx <
                                                missingPermissions?.alternated
                                                    ?.length -
                                                    1 && (
                                                <span
                                                    className={
                                                        styles.alternatedSuffix
                                                    }
                                                >
                                                    {' ' + t('or') + ' '}
                                                </span>
                                            )}
                                        </>
                                    )
                                )}
                            </li>
                        </ul>
                    </>
                ) : (
                    <p>{t('scenePageErrorHandling.assignRoleSuccessDesc')}</p>
                );
                break;
            case ScenePageErrorHandlingMode.ResolvingIssues:
                content = (
                    <Spinner
                        size={SpinnerSize.large}
                        label={t('scenePageErrorHandling.resolvingIssues')}
                    />
                );
                break;
            case ScenePageErrorHandlingMode.FinishedWithSuccess:
                content = (
                    <>
                        <span>
                            {addMissingRolesToContainerAdapterData.adapterResult.getData()
                                ? t(
                                      'scenePageErrorHandling.assignRoleSuccessTitle'
                                  )
                                : t(
                                      'scenePageErrorHandling.noMissingRolesTitle' // if missing roles already assigned without add missing roles call being made in the stepper flow
                                  )}
                        </span>
                        <p>
                            {t('scenePageErrorHandling.assignRoleSuccessDesc')}
                        </p>
                    </>
                );
                break;
            case ScenePageErrorHandlingMode.FinishedWithFailure:
                content = (
                    <>
                        <p>
                            {t(
                                'scenePageErrorHandling.finishedWithFailureDesc'
                            )}
                        </p>
                    </>
                );
                break;
            default:
                break;
        }
        return <div className={styles.progressMessage}>{content}</div>;
    }, [mode, missingPermissions]);

    return (
        <BaseComponent>
            <div className={styles.root}>
                {errorContent}
                {progressContent}
            </div>
        </BaseComponent>
    );
};

export default React.memo(ScenePageErrorHandlingWrapper);
