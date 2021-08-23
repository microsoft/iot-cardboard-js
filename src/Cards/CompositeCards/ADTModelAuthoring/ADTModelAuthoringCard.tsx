import React, { useState } from 'react';
import BaseCompositeCard from '../BaseCompositeCard/Consume/BaseCompositeCard';
import { useTranslation } from 'react-i18next';
import './ADTModelAuthoringCard.scss';
import { ADTModelAuthoringCardProps } from './ADTModelAuthoringCard.types';
import StepperWizard from '../../../Components/StepperWizard/StepperWizard';
import { IStepperWizardStep } from '../../../Models/Constants/Interfaces';
import ADTModelUploaderCard from '../../ADTModelUploaderCard/ADTModelUploaderCard';
import { PrimaryButton } from '@fluentui/react';
import {
    ModelAuthoringModes,
    ModelAuthoringSteps
} from '../../../Models/Constants/Enums';

const ADTModelAuthoringCard: React.FC<ADTModelAuthoringCardProps> = ({
    adapter,
    theme,
    locale,
    localeStrings,
    title
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
                    />
                </div>
                {authoringSteps === ModelAuthoringSteps.SelectType ? (
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <PrimaryButton
                            onClick={() => {
                                setAuthoringMode(
                                    ModelAuthoringModes.UploadFiles
                                );
                                setAuthoringSteps(ModelAuthoringSteps.Review);
                            }}
                            text="Upload DTDL files"
                        />
                        <PrimaryButton text="Create from templates" />
                        <PrimaryButton text="Build from scratch" />
                    </div>
                ) : (
                    authoringMode === ModelAuthoringModes.UploadFiles && (
                        <div className="cb-model-authoring-card-upload-files">
                            <ADTModelUploaderCard
                                adapter={adapter}
                                title="Upload DTDL files"
                                theme={theme}
                                locale={locale}
                                hasUploadButton={true}
                                hasMessageBar={true}
                            />
                        </div>
                    )
                )}
            </BaseCompositeCard>
        </div>
    );
};

export default React.memo(ADTModelAuthoringCard);
