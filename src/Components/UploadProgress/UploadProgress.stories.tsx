import React from 'react';
import { UploadPhase } from '../../Models/Constants';
import { UploadProgress } from './UploadProgress';

export default {
    title: 'Components/UploadProgress'
};

export const MixOfStates = () => (
    <div
        style={{
            height: '400px',
            width: '800px',
            position: 'relative'
        }}
    >
        <UploadProgress
            modelsStatus={{
                phase: UploadPhase.Succeeded,
                message: '14 models uploaded',
                errorMessage: null
            }}
            twinsStatus={{
                phase: UploadPhase.PartiallyFailed,
                message: '247  of 250 twins uploaded',
                errorMessage: 'Twins upload error: 3 twins failed to upload'
            }}
            relationshipsStatus={{
                phase: UploadPhase.Uploading,
                message: '110 of 220',
                errorMessage: null
            }}
        />
    </div>
);

export const AllFailing = () => (
    <div
        style={{
            height: '400px',
            width: '800px',
            position: 'relative'
        }}
    >
        <UploadProgress
            modelsStatus={{
                phase: UploadPhase.Failed,
                message: null,
                errorMessage: 'There was an issue while pushing models to ADT'
            }}
            twinsStatus={{
                phase: UploadPhase.Failed,
                message: null,
                errorMessage: 'There was an issue while pushing twins to ADT'
            }}
            relationshipsStatus={{
                phase: UploadPhase.Failed,
                message: null,
                errorMessage:
                    'There was an issue while pushing relationships to ADT'
            }}
        />
    </div>
);
