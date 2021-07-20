import { FontIcon, Icon } from '@fluentui/react';
import React from 'react';
import { UploadPhase } from '../../Models/Constants';
import './UploadProgress.scss';
export const UploadProgress = ({
    modelsStatus,
    twinsStatus,
    relationshipsStatus
}) => {
    const getIcon = (phase) => {
        if (phase === UploadPhase.Uploading) {
            return 'Upload';
        }
        if (phase === UploadPhase.Succeeded) {
            return 'CheckMark';
        }
        if (phase === UploadPhase.Failed) {
            return 'StatusCircleErrorX';
        }
        return '';
    };

    const getIconClass = (phase) => {
        return `cb-progress-icon ${
            phase === UploadPhase.Succeeded ? 'cb-progress-success' : ''
        }${phase === UploadPhase.Failed ? 'cb-progress-failure' : ''}`;
    };

    const getProgressText = (phase) => {
        if (phase === UploadPhase.Uploading) {
            return 'uploading...';
        }
        if (phase === UploadPhase.Succeeded) {
            return 'success!';
        }
        if (phase === UploadPhase.Failed) {
            return 'failed :(';
        }
    };
    return (
        <div className="cb-upload-progress">
            <h3
                className={`cb-upload-type cb-status-phase-${modelsStatus.phase}`}
            >
                <FontIcon
                    iconName={getIcon(modelsStatus.phase)}
                    className={getIconClass(modelsStatus.phase)}
                ></FontIcon>
                Models
                {modelsStatus.phase !== UploadPhase.PreUpload && (
                    <>: {getProgressText(modelsStatus.phase)}</>
                )}
            </h3>
            {(modelsStatus.phase === UploadPhase.Succeeded ||
                modelsStatus.phase === UploadPhase.Failed) && (
                <StatusMessage status={modelsStatus} />
            )}

            <h3
                className={`cb-upload-type cb-status-phase-${twinsStatus.phase}`}
            >
                <FontIcon
                    iconName={getIcon(twinsStatus.phase)}
                    className={getIconClass(twinsStatus.phase)}
                ></FontIcon>
                Twins
                {twinsStatus.phase !== UploadPhase.PreUpload && (
                    <>: {getProgressText(twinsStatus.phase)}</>
                )}
            </h3>
            <h3
                className={`cb-upload-type cb-status-phase-${relationshipsStatus.phase}`}
            >
                <FontIcon
                    iconName={getIcon(relationshipsStatus.phase)}
                    className={getIconClass(relationshipsStatus.phase)}
                ></FontIcon>
                Relationships
                {relationshipsStatus.phase !== UploadPhase.PreUpload && (
                    <>{getProgressText(relationshipsStatus.phase)}</>
                )}
            </h3>
        </div>
    );
};

const StatusMessage = ({ status }) => {
    return <p className={`cb-status-message`}>{status.message}</p>;
};
