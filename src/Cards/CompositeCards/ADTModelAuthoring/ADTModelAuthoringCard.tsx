import React, { useState } from 'react';
import BaseCompositeCard from '../BaseCompositeCard/Consume/BaseCompositeCard';
import { useTranslation } from 'react-i18next';
import './ADTModelAuthoringCard.scss';
import { ADTModelAuthoringCardProps } from './ADTModelAuthoringCard.types';
import StepperWizard from '../../../Components/StepperWizard/StepperWizard';
import { IStepperWizardStep } from '../../../Models/Constants/Interfaces';
import ADTModelUploaderCard from '../../ADTModelUploaderCard/ADTModelUploaderCard';
import { DefaultButton, Icon, Link, PrimaryButton } from '@fluentui/react';
import {
    ModelAuthoringModes,
    ModelAuthoringSteps
} from '../../../Models/Constants/Enums';

const ADTModelAuthoringCard: React.FC<ADTModelAuthoringCardProps> = ({
    adapter,
    theme,
    locale,
    localeStrings,
    title,
    onCancel
}) => {
    const { t } = useTranslation();
    const [
        authoringMode,
        setAuthoringMode
    ] = useState<ModelAuthoringModes | null>(null);
    const [authoringSteps, setAuthoringSteps] = useState<ModelAuthoringSteps>(
        ModelAuthoringSteps.SelectType
    );

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
                                    description="Files must be .Json format, no exceed than 50MB."
                                    actionText="Upload"
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
                                    actionText="Open"
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
                                    actionText="Start"
                                    onClick={() => {
                                        setAuthoringMode(
                                            ModelAuthoringModes.UploadFiles
                                        );
                                        setAuthoringSteps(
                                            ModelAuthoringSteps.Review
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        authoringMode === ModelAuthoringModes.UploadFiles && (
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
                        )
                    )}
                </BaseCompositeCard>
            </div>
            <div className="cb-model-authoring-card-footer">
                <div className="cb-navigation-left">
                    <DefaultButton onClick={onCancel} text={t('cancel')} />
                </div>
                <div className="cb-navigation-right">
                    <DefaultButton onClick={onCancel} text={t('previous')} />
                    <PrimaryButton onClick={onCancel} text={t('next')} />
                </div>
            </div>
        </div>
    );
};

const AuthoringModeSelector = ({
    iconName,
    title,
    description,
    actionText,
    onClick
}) => {
    return (
        <div className="cb-model-authoring-card-mode-selector">
            <div className="cb-model-authoring-card-mode-selector-icon">
                <Icon iconName={iconName} />
            </div>
            <div className="cb-model-authoring-card-mode-selector-content">
                <div>
                    <span className="cb-title">{title}</span>
                    <p className="cb-description">{description}</p>
                </div>
                <div>
                    <Link onClick={onClick}>{actionText}</Link>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ADTModelAuthoringCard);
