import { FontIcon, MessageBar, MessageBarType } from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AssetTypes, UploadPhase } from '../../Models/Constants';
import './UploadProgress.scss';
export const UploadProgress = ({
    modelsStatus,
    twinsStatus,
    relationshipsStatus,
}) => {
    return (
        <div className={'cb-upload-progress'}>
            <hr className={'cb-progress-line'} />
            <div className={'cb-upload-sections-container'}>
                <UploadSection
                    status={modelsStatus}
                    uploadType={AssetTypes.Models}
                    stepNumber={1}
                />
                <UploadSection
                    status={twinsStatus}
                    uploadType={AssetTypes.Twins}
                    stepNumber={2}
                />
                <UploadSection
                    status={relationshipsStatus}
                    uploadType={AssetTypes.Relationships}
                    stepNumber={3}
                />
            </div>

            <div className={'cb-error-section'}>
                <ErrorMessage uploadStatus={modelsStatus} />
                <ErrorMessage uploadStatus={twinsStatus} />
                <ErrorMessage uploadStatus={relationshipsStatus} />
            </div>
        </div>
    );
};

const StepIcon = ({ status, stepNumber }) => {
    if (
        status.phase === UploadPhase.PreUpload ||
        status.phase === UploadPhase.Uploading
    ) {
        return <>{stepNumber}</>;
    }

    const iconMap = {};
    iconMap[UploadPhase.Failed] = 'StatusCircleErrorX';
    iconMap[UploadPhase.Succeeded] = 'CheckMark';
    iconMap[UploadPhase.PartiallyFailed] = 'Warning';
    return (
        <FontIcon
            iconName={iconMap[status.phase]}
            className={'cb-font-icon'}
        ></FontIcon>
    );
};

const ErrorMessage = ({ uploadStatus }) => {
    return (
        uploadStatus.errorMessage && (
            <MessageBar messageBarType={MessageBarType.error}>
                {uploadStatus.errorMessage}
            </MessageBar>
        )
    );
};

const UploadSection = ({ status, uploadType, stepNumber }) => {
    const { t } = useTranslation();
    const getHeaderText = (phase) => {
        if (phase === UploadPhase.Uploading) {
            return t('uploadProgress.uploading', { assetType: uploadType });
        }
        if (phase === UploadPhase.Succeeded) {
            return t('uploadProgress.uploadSuccess', { assetType: uploadType });
        }
        if (phase === UploadPhase.PartiallyFailed) {
            return t('uploadProgress.uploadPartiallyFailed', {
                assetType: uploadType,
            });
        }
        if (phase === UploadPhase.Failed) {
            return t('uploadProgress.uploadFailed', { assetType: uploadType });
        }
    };

    return (
        <div className={'cb-upload-section'}>
            <div
                className={`cb-progress-status cb-status-phase-${status.phase}`}
            >
                <StepIcon status={status} stepNumber={stepNumber} />
            </div>
            <div className={'cb-upload-section-text'}>
                <h3 className={'cb-upload-section-header'}>
                    {getHeaderText(status.phase)}
                </h3>
                {status.message && (
                    <p className={'cb-upload-section-content'}>
                        {status.message}
                    </p>
                )}
            </div>
        </div>
    );
};
