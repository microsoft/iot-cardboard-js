import { AuthErrorMessage } from '@azure/msal-browser';
import { FontIcon, MessageBar, MessageBarType } from '@fluentui/react';
import React from 'react';
import { UploadPhase } from '../../Models/Constants';
import './UploadProgress.scss';
export const UploadProgress = ({
    modelsStatus,
    twinsStatus,
    relationshipsStatus
}) => {
    return (
        <div className="cb-upload-progress">
            <hr className="cb-progress-line" />
            <div className="cb-upload-sections-container">
                <UploadSection
                    status={modelsStatus}
                    uploadType={'models'}
                    stepNumber={1}
                />
                <UploadSection
                    status={twinsStatus}
                    uploadType={'twins'}
                    stepNumber={2}
                />
                <UploadSection
                    status={relationshipsStatus}
                    uploadType={'relationships'}
                    stepNumber={3}
                />
            </div>

            <div className="cb-error-section">
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
            className="cb-font-icon"
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
    const getHeaderText = (phase) => {
        if (phase === UploadPhase.Uploading) {
            return `Uploading ${uploadType}...`;
        }
        if (phase === UploadPhase.Succeeded) {
            return `Uploaded ${uploadType}`;
        }
        if (phase === UploadPhase.PartiallyFailed) {
            return `Uploaded ${uploadType} with some failures`;
        }
        if (phase === UploadPhase.Failed) {
            return `Error while uploading ${uploadType}`;
        }
    };

    return (
        <div className="cb-upload-section">
            <div
                className={`cb-progress-status cb-status-phase-${status.phase}`}
            >
                <StepIcon status={status} stepNumber={stepNumber} />
            </div>
            <div className="cb-upload-section-text">
                <h3 className="cb-upload-section-header">
                    {getHeaderText(status.phase)}
                </h3>
                {status.phase !== UploadPhase.Failed && (
                    <p className="cb-upload-section-content">
                        {status.message}
                    </p>
                )}
            </div>
        </div>
    );
};
