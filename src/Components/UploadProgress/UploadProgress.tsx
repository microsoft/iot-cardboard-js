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
            <h3
                className={`cb-upload-type cb-status-phase-${modelsStatus.phase}`}
            >
                1. Models upload
            </h3>
            {modelsStatus.phase !== UploadPhase.PreUpload && (
                <StatusMessage status={modelsStatus} />
            )}
            <h3
                className={`cb-upload-type cb-status-phase-${twinsStatus.phase}`}
            >
                2. Twins upload
            </h3>
            {twinsStatus.phase !== UploadPhase.PreUpload && (
                <StatusMessage status={twinsStatus} />
            )}
            <h3
                className={`cb-upload-type cb-status-phase-${relationshipsStatus.phase}`}
            >
                3. Relationships upload
            </h3>
            {relationshipsStatus.phase !== UploadPhase.PreUpload && (
                <StatusMessage status={relationshipsStatus} />
            )}
        </div>
    );
};

const StatusMessage = ({ status }) => {
    return (
        <p className={`cb-status-message cb-status-phase-${status.phase}`}>
            {status.message}
        </p>
    );
};
