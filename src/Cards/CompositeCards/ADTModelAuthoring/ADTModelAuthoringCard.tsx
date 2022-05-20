import React, { useEffect, useMemo, useRef, useState } from 'react';
import BaseCompositeCard from '../BaseCompositeCard/BaseCompositeCard';
import { useTranslation } from 'react-i18next';
import './ADTModelAuthoringCard.scss';
import { ADTModelAuthoringCardProps } from './ADTModelAuthoringCard.types';
import StepperWizard from '../../../Components/StepperWizard/StepperWizard';
import { DTModel, IADTModel } from '../../../Models/Constants/Interfaces';
import ADTModelUploaderCard from '../../ADTModelUploaderCard/ADTModelUploaderCard';
import {
    ActivityItem,
    DefaultButton,
    DetailsList,
    DetailsListLayoutMode,
    IActivityItemProps,
    Icon,
    Link,
    MessageBar,
    MessageBarType,
    PrimaryButton,
    SelectionMode
} from '@fluentui/react';
import {
    FormMode,
    ModelAuthoringModes,
    ModelAuthoringSteps,
    UploadPhase
} from '../../../Models/Constants/Enums';
import ModelCreate from '../../../Components/ModelCreate/ModelCreate';
import ModelSearch from '../../../Components/ModelSearch/ModelSearch';
import CdnModelSearchAdapter from '../../../Adapters/CdnModelSearchAdapter';
import useAdapter from '../../../Models/Hooks/useAdapter';
import { DTDLModel } from '../../../Models/Classes/DTDL';
import {
    IStepperWizardStep,
    StepperWizardType
} from '../../../Components/StepperWizard/StepperWizard.types';

const ADTModelAuthoringCard: React.FC<ADTModelAuthoringCardProps> = ({
    adapter,
    theme,
    locale,
    localeStrings,
    title,
    onCancel,
    onPublish,
    existingModelIds
}) => {
    const { t } = useTranslation();
    const [
        authoringMode,
        setAuthoringMode
    ] = useState<ModelAuthoringModes | null>(null);
    const [authoringStep, setAuthoringSteps] = useState<ModelAuthoringSteps>(
        ModelAuthoringSteps.SelectType
    );
    const [modelsToPublish, setModelsToPublish] = useState([]);
    const existingModelIdsRef = useRef(existingModelIds ?? []);
    const existingFilesRef = useRef([]);
    const modelUploaderComponentRef = useRef();
    const modelCreateComponentRef = useRef();
    const [errorMessage, setErrorMessage] = useState(null);
    const [uploadingStatus, setUploadingStatus] = useState(
        UploadPhase.PreUpload
    );

    const pushModelsState = useAdapter({
        adapterMethod: (models: Array<DTModel>) =>
            adapter.createADTModels(models),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    const steps: Array<IStepperWizardStep> = [
        { label: t('modelAuthoring.selectType') },
        { label: t('modelAuthoring.review') },
        { label: t('modelAuthoring.publish') }
    ];

    const onNextClick = () => {
        if (authoringStep === ModelAuthoringSteps.Publish) {
            setErrorMessage(null);
            pushModelsState.callAdapter(modelsToPublish);
        } else {
            if (authoringMode === ModelAuthoringModes.BuildForm) {
                const modelToPublish = (modelCreateComponentRef.current as any)?.getModel();
                setModelsToPublish([modelToPublish.trimmedCopy() as DTModel]);
            }
            setAuthoringSteps(authoringStep + 1);
        }
    };

    const onPreviousClick = () => {
        setErrorMessage(null);
        setAuthoringSteps(authoringStep - 1);
    };

    const onCancelClick = () => {
        if (onCancel && typeof onCancel === 'function') {
            onCancel();
        }
    };

    const onFileListChanged = (files: Array<File>) => {
        existingFilesRef.current = files;
        setModelsToPublish(
            (modelUploaderComponentRef.current as any).getJsonList()
        );
    };

    const onRemoveSelectedModel = (modelId: string) => {
        setModelsToPublish(modelsToPublish.filter((m) => m['@id'] !== modelId));
    };

    const isNextButtonVisible = useMemo(() => {
        if (
            (authoringMode === ModelAuthoringModes.UploadFiles ||
                authoringMode === ModelAuthoringModes.FromTemplate) &&
            authoringStep === ModelAuthoringSteps.Review &&
            modelsToPublish.length === 0
        ) {
            return false;
        }
        return true;
    }, [modelsToPublish, authoringStep]);

    useEffect(() => {
        if (pushModelsState.adapterResult.errorInfo?.errors?.length) {
            if (
                pushModelsState.adapterResult.getCatastrophicError()?.rawError
            ) {
                setUploadingStatus(UploadPhase.Failed);
                setErrorMessage(
                    t('uploadProgress.uploadFailed', {
                        assetType: 'models'
                    }) +
                        ': ' +
                        (pushModelsState.adapterResult?.getCatastrophicError()
                            ?.rawError as any).response.data.error.message
                );
            } else {
                setUploadingStatus(UploadPhase.PartiallyFailed);
                setErrorMessage(
                    t('generateADTAssets.partialError', {
                        assetType: 'models',
                        errorCount:
                            pushModelsState.adapterResult.errorInfo.errors
                                .length
                    })
                );
            }
        } else if (pushModelsState.adapterResult?.getData()) {
            setUploadingStatus(UploadPhase.Succeeded);
            setErrorMessage(
                t('uploadProgress.uploadSuccess', {
                    assetType: 'models'
                })
            );
        }

        const createdModels = pushModelsState?.adapterResult.getData() as Array<IADTModel>;
        if (createdModels?.length) {
            onPublish(createdModels);
        }
    }, [pushModelsState?.adapterResult]);

    return (
        <div className="cb-model-authoring-card-wrapper">
            <div className="cb-model-authoring-card-main">
                <BaseCompositeCard
                    title={title}
                    theme={theme}
                    locale={locale}
                    localeStrings={localeStrings}
                >
                    <div className="cb-model-authoring-card-wizard">
                        <StepperWizard
                            type={StepperWizardType.Vertical}
                            steps={steps}
                            currentStepIndex={authoringStep}
                            isNavigationDisabled={true}
                        />
                    </div>
                    <div className="cb-model-authoring-card-step">
                        {authoringStep === ModelAuthoringSteps.SelectType ? (
                            <>
                                <div className="cb-model-authoring-card-step-title">
                                    {t('modelAuthoring.selectType')}
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row'
                                    }}
                                >
                                    <AuthoringModeSelector
                                        iconName={'Upload'}
                                        title={t(
                                            'modelAuthoring.authoringModes.uploadDTDLFiles'
                                        )}
                                        description={t(
                                            'modelAuthoring.authoringModes.uploadDTDLFilesDesc'
                                        )}
                                        onClick={() => {
                                            setAuthoringMode(
                                                ModelAuthoringModes.UploadFiles
                                            );
                                            setAuthoringSteps(
                                                ModelAuthoringSteps.Review
                                            );
                                            setModelsToPublish([]);
                                            existingFilesRef.current = [];
                                        }}
                                    />
                                    <AuthoringModeSelector
                                        iconName={'TextDocument'}
                                        title={t(
                                            'modelAuthoring.authoringModes.createFromTemplates'
                                        )}
                                        description={t(
                                            'modelAuthoring.authoringModes.createFromTemplatesDesc'
                                        )}
                                        onClick={() => {
                                            setAuthoringMode(
                                                ModelAuthoringModes.FromTemplate
                                            );
                                            setAuthoringSteps(
                                                ModelAuthoringSteps.Review
                                            );
                                            setModelsToPublish([]);
                                        }}
                                    />
                                    <AuthoringModeSelector
                                        iconName={'Document'}
                                        title={t(
                                            'modelAuthoring.authoringModes.buildFromScratch'
                                        )}
                                        description={t(
                                            'modelAuthoring.authoringModes.buildFromScratchDesc'
                                        )}
                                        onClick={() => {
                                            setAuthoringMode(
                                                ModelAuthoringModes.BuildForm
                                            );
                                            setAuthoringSteps(
                                                ModelAuthoringSteps.Review
                                            );
                                            setModelsToPublish([]);
                                        }}
                                    />
                                </div>
                            </>
                        ) : authoringStep === ModelAuthoringSteps.Review ? (
                            <>
                                {authoringMode ===
                                    ModelAuthoringModes.UploadFiles && (
                                    <div className="cb-model-authoring-card-upload-files">
                                        <div className="cb-model-authoring-card-step-title">
                                            {t(
                                                'modelAuthoring.authoringModes.uploadDTDLFiles'
                                            )}
                                        </div>
                                        <ADTModelUploaderCard
                                            adapter={adapter}
                                            theme={theme}
                                            locale={locale}
                                            hasUploadButton={false}
                                            hasMessageBar={true}
                                            onFileListChanged={
                                                onFileListChanged
                                            }
                                            existingFiles={
                                                existingFilesRef.current
                                            }
                                            ref={modelUploaderComponentRef}
                                        />
                                    </div>
                                )}

                                {authoringMode ===
                                    ModelAuthoringModes.FromTemplate && (
                                    <div className="cb-model-authoring-card-from-template">
                                        <div className="cb-model-authoring-card-step-title">
                                            {t(
                                                'modelAuthoring.selectTemplates'
                                            )}
                                        </div>
                                        <ModelSearch
                                            adapter={
                                                new CdnModelSearchAdapter(
                                                    'https://devicemodelstest.azure.com',
                                                    10
                                                )
                                            }
                                            onStandardModelSelection={(
                                                modelData
                                            ) =>
                                                setModelsToPublish(
                                                    modelsToPublish.concat(
                                                        modelData.filter(
                                                            function (item) {
                                                                return (
                                                                    modelsToPublish.findIndex(
                                                                        (mTp) =>
                                                                            mTp[
                                                                                '@id'
                                                                            ] ===
                                                                            item[
                                                                                '@id'
                                                                            ]
                                                                    ) === -1
                                                                );
                                                            }
                                                        )
                                                    )
                                                )
                                            }
                                            primaryActionText={t('select')}
                                        />
                                        <div
                                            className={`cb-selected-models ${
                                                modelsToPublish.length === 0
                                                    ? 'cb-collapse'
                                                    : ''
                                            }`}
                                        >
                                            {modelsToPublish
                                                .map((m) => ({
                                                    key: `cb-selected-model-${m['@id']}`,
                                                    activityDescription: [
                                                        <span
                                                            key={`cb-selected-model-name-${m['@id']}`}
                                                            style={{
                                                                fontWeight:
                                                                    'bold'
                                                            }}
                                                        >
                                                            {m['@id']}
                                                        </span>,
                                                        <span
                                                            key={`cb-selected-model-desc-${m['@id']}`}
                                                        >
                                                            {' '}
                                                            {t(
                                                                'modelAuthoring.addedToBePublished'
                                                            )}
                                                        </span>,
                                                        <span
                                                            key={`cb-selected-model-action-${m['@id']}`}
                                                        >
                                                            {' '}
                                                            <Link
                                                                onClick={() =>
                                                                    onRemoveSelectedModel(
                                                                        m['@id']
                                                                    )
                                                                }
                                                            >
                                                                {t('remove')}
                                                            </Link>
                                                        </span>
                                                    ],
                                                    activityIcon: (
                                                        <Icon
                                                            iconName={'Add'}
                                                        />
                                                    ),
                                                    isCompact: true
                                                }))
                                                .map(
                                                    (item: {
                                                        key: string | number;
                                                    }) => (
                                                        <ActivityItem
                                                            {...(item as IActivityItemProps)}
                                                            key={item.key}
                                                            className="cb-selected-model"
                                                        />
                                                    )
                                                )}
                                        </div>
                                    </div>
                                )}
                                {authoringMode ===
                                    ModelAuthoringModes.BuildForm && (
                                    <div className="cb-model-authoring-card-new-model">
                                        <ModelCreate
                                            locale={locale}
                                            modelToEdit={
                                                modelsToPublish[0]
                                                    ? DTDLModel.fromObject(
                                                          modelsToPublish[0]
                                                      )
                                                    : null
                                            }
                                            existingModelIds={
                                                existingModelIdsRef.current
                                            }
                                            onCancel={() =>
                                                setAuthoringSteps(
                                                    ModelAuthoringSteps.SelectType
                                                )
                                            }
                                            formControlMode={FormMode.New}
                                            isPrimaryActionButtonsVisible={
                                                false
                                            }
                                            isShowDTDLButtonVisible={true}
                                            ref={modelCreateComponentRef}
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="cb-model-authoring-card-step-title">
                                    {t('modelAuthoring.publishModels')}
                                </div>
                                <ModelsToPublishList
                                    models={modelsToPublish}
                                    t={t}
                                />
                                {errorMessage && (
                                    <MessageBar
                                        messageBarType={
                                            uploadingStatus ===
                                            UploadPhase.Succeeded
                                                ? MessageBarType.success
                                                : uploadingStatus ===
                                                  UploadPhase.PartiallyFailed
                                                ? MessageBarType.warning
                                                : MessageBarType.error
                                        }
                                        dismissButtonAriaLabel={t('close')}
                                        onDismiss={() => setErrorMessage(null)}
                                        className="cb-model-authoring-card-error-message"
                                    >
                                        {errorMessage}
                                    </MessageBar>
                                )}
                            </>
                        )}
                    </div>
                </BaseCompositeCard>
            </div>
            <div className="cb-model-authoring-card-footer">
                <div className="cb-navigation-left">
                    <DefaultButton onClick={onCancelClick} text={t('cancel')} />
                </div>
                {authoringStep !== ModelAuthoringSteps.SelectType && (
                    <div className="cb-navigation-right">
                        <DefaultButton
                            onClick={onPreviousClick}
                            text={t('previous')}
                        />
                        {isNextButtonVisible && (
                            <PrimaryButton
                                className="cb-model-authoring-primary-action-button"
                                onClick={onNextClick}
                                text={
                                    pushModelsState.isLoading
                                        ? t('modelAuthoring.publishing')
                                        : authoringStep ===
                                          ModelAuthoringSteps.Publish
                                        ? t('modelAuthoring.publish')
                                        : t('next')
                                }
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const AuthoringModeSelector = ({ iconName, title, description, onClick }) => {
    return (
        <div
            className="cb-model-authoring-card-mode-selector"
            onClick={onClick}
        >
            <div className="cb-model-authoring-card-mode-selector-icon">
                <Icon iconName={iconName} />
            </div>
            <div className="cb-model-authoring-card-mode-selector-content">
                <div>
                    <span className="cb-title">{title}</span>
                    <p className="cb-description">{description}</p>
                </div>
            </div>
        </div>
    );
};

const ModelsToPublishList = ({ models, t }) => {
    return (
        <DetailsList
            className="cb-file-list"
            items={models}
            columns={[
                {
                    key: 'cb-model-list-column-name',
                    name: t('displayName'),
                    minWidth: 210,
                    maxWidth: 350,
                    isResizable: true,
                    onRender: (item) => (
                        <span>{item.displayName?.en ?? item.displayName}</span>
                    )
                },
                {
                    key: 'cb-model-list-column-type',
                    name: t('type'),
                    minWidth: 60,
                    maxWidth: 120,
                    onRender: (item) => <span>{item['@type']}</span>
                },
                {
                    key: 'cb-model-list-column-id',
                    name: t('id'),
                    minWidth: 40,
                    onRender: (item) => item['@id']
                },
                {
                    key: 'cb-model-list-column-inherit',
                    name: t('modelCreate.inherit'),
                    minWidth: 110,
                    maxWidth: 250,
                    onRender: (item) => item.extends?.toString(', ')
                }
            ]}
            layoutMode={DetailsListLayoutMode.justified}
            selectionMode={SelectionMode.none}
            styles={{
                root: {
                    overflow: 'hidden',
                    selectors: {
                        '.ms-DetailsRow-cell': {
                            height: 32,
                            paddingLeft: 20,
                            fontSize: '14px'
                        },
                        '.ms-DetailsHeader': {
                            paddingTop: 0
                        },
                        '.ms-DetailsHeader-cellTitle': {
                            paddingLeft: 20
                        }
                    }
                }
            }}
        />
    );
};

export default React.memo(ADTModelAuthoringCard);
