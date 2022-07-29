import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import {
    DOCUMENTATION_LINKS,
    IAdapterData,
    IComponentError,
    IUseAdapter,
    MissingAzureRoleDefinitionAssignments
} from '../../../Models/Constants';
import { PrimaryButton, Spinner, SpinnerSize } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { ScenePageErrorHandlingMode } from '../ScenePageErrorHandlingWrapper.types';
import IllustrationMessage from '../../IllustrationMessage/IllustrationMessage';
import PriviledgedAccessImg from '../../../Resources/Static/priviledgedAccess.svg';
import useAdapter from '../../../Models/Hooks/useAdapter';
import { getScenePageErrorHandlingStyles } from '../ScenePageErrorHandlingWrapper.styles';
import StepperWizard from '../../StepperWizard/StepperWizard';
import {
    IStepperWizardStep,
    StepperWizardType
} from '../../StepperWizard/StepperWizard.types';
import ADT3DSceneAdapter from '../../../Adapters/ADT3DSceneAdapter';
import MockAdapter from '../../../Adapters/MockAdapter';

interface UnauthorizedAccessHandlingProps {
    adapter: ADT3DSceneAdapter | MockAdapter;
    errors: Array<IComponentError>;
    verifyCallbackAdapterData?: IUseAdapter<IAdapterData>;
}

const UnauthorizedAccessHandling: React.FC<UnauthorizedAccessHandlingProps> = ({
    // for now this unauthorized access handling component is designed for blob service, not for ADT
    adapter,
    errors,
    verifyCallbackAdapterData
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
                verifyCallbackAdapterData.callAdapter();
            } else if (
                mode === ScenePageErrorHandlingMode.FinishedWithFailure
            ) {
                window.open(DOCUMENTATION_LINKS.overviewDocSetupSection);
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
            verifyCallbackAdapterData.isLoading
                ? setInternalPrimaryButtonText(
                      t('scenePageErrorHandling.refreshing')
                  )
                : setInternalPrimaryButtonText(
                      t('scenePageErrorHandling.refreshPage')
                  );
        } else if (mode === ScenePageErrorHandlingMode.FinishedWithFailure) {
            setInternalPrimaryButtonText(t('learnMore'));
        }
    }, [mode, verifyCallbackAdapterData?.isLoading]);

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
                    verifyCallbackAdapterData.callAdapter();
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
                verifyCallbackAdapterData.callAdapter();
            }, 15000);
        } else if (
            addMissingRolesToContainerAdapterData.adapterResult.getErrors()
        ) {
            setMode(ScenePageErrorHandlingMode.FinishedWithFailure);
        }
        return () => clearInterval(reloadPageTimeoutRef.current);
    }, [addMissingRolesToContainerAdapterData?.adapterResult.result]);

    const styles = getScenePageErrorHandlingStyles();
    const errorContent = useMemo(
        () => (
            <IllustrationMessage
                headerText={
                    mode === ScenePageErrorHandlingMode.FinishedWithSuccess
                        ? t('success')
                        : t(
                              'scenePageErrorHandling.unauthorizedAccessErrorTitle'
                          )
                }
                {...(mode === ScenePageErrorHandlingMode.Idle && {
                    descriptionText: t(
                        'scenePageErrorHandling.unauthorizedAccessErrorMessage'
                    ),
                    linkProps: {
                        target: '_blank',
                        underline: true,
                        href: DOCUMENTATION_LINKS.overviewDocSetupSection
                    },
                    linkText: t('learnMore')
                })}
                type={'error'}
                width={'wide'}
                imageProps={{
                    src: PriviledgedAccessImg,
                    height: 200
                }}
                styles={{ container: { height: 'auto' } }}
            />
        ),
        [errors, mode]
    );

    const progressContent = useMemo(() => {
        // in addition to errorContent we also have progressContent to render to handle this special type of error
        let content;
        const steps: Array<IStepperWizardStep> = [
            {
                label: t('diagnose')
            },
            {
                label: t('resolve')
            },
            {
                label: t('verify')
            }
        ];
        let currentStepIndex = 0;
        switch (mode) {
            case ScenePageErrorHandlingMode.CheckingIssues:
                currentStepIndex = 0;
                content = (
                    <Spinner
                        size={SpinnerSize.medium}
                        label={t('scenePageErrorHandling.checkingPermissions')}
                    />
                );
                break;
            case ScenePageErrorHandlingMode.DiagnosedIssues:
                currentStepIndex = 1;
                content = missingPermissions ? (
                    <p>
                        {t('scenePageErrorHandling.missingPermissionsMessage')}
                    </p>
                ) : (
                    <p>{t('scenePageErrorHandling.assignRoleSuccessDesc')}</p>
                );
                break;
            case ScenePageErrorHandlingMode.ResolvingIssues:
                currentStepIndex = 1;
                content = (
                    <Spinner
                        size={SpinnerSize.medium}
                        label={t('scenePageErrorHandling.resolvingIssues')}
                    />
                );
                break;
            case ScenePageErrorHandlingMode.FinishedWithSuccess:
                currentStepIndex = 2;
                content = (
                    <p>
                        {addMissingRolesToContainerAdapterData.adapterResult.getData()
                            ? t('scenePageErrorHandling.assignRoleSuccessDesc')
                            : t(
                                  'scenePageErrorHandling.noMissingRoleDesc' // if missing roles already assigned without add missing roles attempt being made in the stepper flow
                              )}
                    </p>
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
        return (
            <div className={styles.progressContainer}>
                {mode > ScenePageErrorHandlingMode.Idle && (
                    <StepperWizard
                        type={StepperWizardType.Horizontal}
                        steps={steps}
                        currentStepIndex={currentStepIndex}
                        isCurrentStepWithWarning={
                            mode ===
                            ScenePageErrorHandlingMode.FinishedWithFailure
                        }
                        isNavigationDisabled
                        includeIcons
                    />
                )}
                {content && (
                    <div className={styles.progressMessage}>{content}</div>
                )}
                {(mode === ScenePageErrorHandlingMode.Idle ||
                    mode === ScenePageErrorHandlingMode.DiagnosedIssues ||
                    mode ===
                        ScenePageErrorHandlingMode.FinishedWithFailure) && (
                    <PrimaryButton
                        onClick={onInternalPrimaryActionButtonClick}
                        text={internalPrimaryButtonText}
                        styles={{ root: { maxWidth: 236, marginTop: 16 } }}
                    />
                )}
                {mode === ScenePageErrorHandlingMode.FinishedWithSuccess && (
                    <Spinner
                        size={SpinnerSize.medium}
                        label={t(
                            'scenePageErrorHandling.verifyingPermissionsMessage'
                        )}
                        styles={{ label: { whiteSpace: 'pre-line' } }}
                    />
                )}
            </div>
        );
    }, [
        mode,
        missingPermissions,
        onInternalPrimaryActionButtonClick,
        internalPrimaryButtonText
    ]);

    return (
        <>
            {errorContent}
            {progressContent}
        </>
    );
};

export default React.memo(UnauthorizedAccessHandling);
