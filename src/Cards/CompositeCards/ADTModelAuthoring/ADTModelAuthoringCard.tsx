import React, { useRef, useState } from 'react';
import BaseCompositeCard from '../BaseCompositeCard/Consume/BaseCompositeCard';
import { useTranslation } from 'react-i18next';
import './ADTModelAuthoringCard.scss';
import { ADTModelAuthoringCardProps } from './ADTModelAuthoringCard.types';
import StepperWizard from '../../../Components/StepperWizard/StepperWizard';
import {
    DTModel,
    IADTModel,
    IStepperWizardStep
} from '../../../Models/Constants/Interfaces';
import ADTModelUploaderCard from '../../ADTModelUploaderCard/ADTModelUploaderCard';
import { DefaultButton, Icon, PrimaryButton } from '@fluentui/react';
import {
    FormMode,
    ModelAuthoringModes,
    ModelAuthoringSteps
} from '../../../Models/Constants/Enums';
import ModelCreate from '../../../Components/ModelCreate/ModelCreate';
import { DTDLModel } from '../../../Models/Classes/DTDL';
import AdapterResult from '../../../Models/Classes/AdapterResult';
import { ADTAdapterModelsData } from '../../../Models/Classes/AdapterDataClasses/ADTAdapterData';

const ADTModelAuthoringCard: React.FC<ADTModelAuthoringCardProps> = ({
    adapter,
    theme,
    locale,
    localeStrings,
    title,
    onCancel,
    existingModelIds
}) => {
    const { t } = useTranslation();
    const [
        authoringMode,
        setAuthoringMode
    ] = useState<ModelAuthoringModes | null>(null);
    const [authoringSteps, setAuthoringSteps] = useState<ModelAuthoringSteps>(
        ModelAuthoringSteps.SelectType
    );
    const existingModelIdsRef = useRef(existingModelIds ?? []);
    const newModelComponentRef = useRef();

    const steps: Array<IStepperWizardStep> = [
        {
            label: t('modelAuthoring.selectType'),
            onClick: () => {
                setAuthoringSteps(ModelAuthoringSteps.SelectType);
            }
        },
        {
            label: t('modelAuthoring.review')
        },
        {
            label: t('modelAuthoring.publish')
        }
    ];

    const handleNewModelClick = async (model: DTDLModel) => {
        const resolvedModels: AdapterResult<ADTAdapterModelsData> = await adapter.createADTModels(
            [model.trimmedCopy() as DTModel]
        );
        // if (resolvedModels.getCatastrophicError()?.rawError) {
        //     setErrorMessage(
        //         (resolvedModels.getCatastrophicError().rawError as any).response
        //             ?.data?.error?.message
        //     );
        // } else {
        const resolvedModel = resolvedModels.getData()?.[0] as IADTModel;
        console.log(resolvedModel);
        // }
    };

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
                            steps={steps}
                            currentStepIndex={authoringSteps}
                            isNavigationDisabled={true}
                        />
                    </div>
                    {authoringSteps === ModelAuthoringSteps.SelectType ? (
                        <div>
                            <div
                                style={{
                                    fontSize: 18,
                                    fontWeight: 600,
                                    padding: '20px 0px'
                                }}
                            >
                                Select Type
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row'
                                }}
                            >
                                <AuthoringModeSelector
                                    iconName={'Upload'}
                                    title="Upload DTDL files"
                                    description="File type must be JSON, no exceed than 50MB."
                                    onClick={() => {
                                        setAuthoringMode(
                                            ModelAuthoringModes.UploadFiles
                                        );
                                        setAuthoringSteps(
                                            ModelAuthoringSteps.Review
                                        );
                                    }}
                                />
                                <AuthoringModeSelector
                                    iconName={'TextDocument'}
                                    title="Create from templates"
                                    description="Bring in standard models from library and edit from there."
                                    onClick={() => {
                                        setAuthoringMode(
                                            ModelAuthoringModes.UploadFiles
                                        );
                                        setAuthoringSteps(
                                            ModelAuthoringSteps.Review
                                        );
                                    }}
                                />
                                <AuthoringModeSelector
                                    iconName={'Document'}
                                    title="Build from scratch"
                                    description="Using built-in modules to create a DTDL model, no code is needed."
                                    onClick={() => {
                                        setAuthoringMode(
                                            ModelAuthoringModes.BuildForm
                                        );
                                        setAuthoringSteps(
                                            ModelAuthoringSteps.Review
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    ) : authoringMode === ModelAuthoringModes.UploadFiles ? (
                        <div className="cb-model-authoring-card-upload-files">
                            <div
                                style={{
                                    fontSize: 18,
                                    fontWeight: 600,
                                    padding: '20px 0px'
                                }}
                            >
                                Upload DTDL files
                            </div>
                            <ADTModelUploaderCard
                                adapter={adapter}
                                theme={theme}
                                locale={locale}
                                hasUploadButton={false}
                                hasMessageBar={true}
                            />
                        </div>
                    ) : (
                        authoringMode === ModelAuthoringModes.BuildForm && (
                            <div className="cb-model-authoring-card-new-model">
                                <div
                                    style={{
                                        padding: '10px 0px'
                                    }}
                                ></div>
                                <ModelCreate
                                    locale={locale}
                                    modelToEdit={null}
                                    existingModelIds={
                                        existingModelIdsRef.current
                                    }
                                    onCancel={() =>
                                        setAuthoringSteps(
                                            ModelAuthoringSteps.SelectType
                                        )
                                    }
                                    onPrimaryAction={handleNewModelClick}
                                    formControlMode={FormMode.New}
                                    ref={newModelComponentRef}
                                />
                            </div>
                        )
                    )}
                </BaseCompositeCard>
            </div>
            <div className="cb-model-authoring-card-footer">
                <div className="cb-navigation-left">
                    <DefaultButton onClick={onCancel} text={t('cancel')} />
                </div>
                {authoringSteps !== ModelAuthoringSteps.SelectType && (
                    <div className="cb-navigation-right">
                        <DefaultButton
                            onClick={() =>
                                setAuthoringSteps(authoringSteps - 1)
                            }
                            text={t('previous')}
                        />
                        <PrimaryButton onClick={onCancel} text={t('next')} />
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

export default React.memo(ADTModelAuthoringCard);
