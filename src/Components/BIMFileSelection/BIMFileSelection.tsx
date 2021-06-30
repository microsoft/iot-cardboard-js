import { PrimaryButton } from '@fluentui/react';
import React, { useCallback } from 'react';
import { IBIMFileSelectionProps } from '../../Models/Constants';
import './BIMFileSelection.scss';

const BIMFileSelection: React.FC<IBIMFileSelectionProps> = ({ onSubmit }) => {
    const wrappedOnSubmit = useCallback(() => {
        onSubmit(
            'https://cardboardresources.blob.core.windows.net/carboard-bim-files/duplex.xkt',
            'https://cardboardresources.blob.core.windows.net/carboard-bim-files/duplexMetaModel.json'
        );
    }, [onSubmit]);

    return (
        <div className="cb-bim-file-selection-container">
            <label className="cb-bim-input-label">BIM file path</label>
            <input
                className="cb-bim-input"
                defaultValue="https://cardboardresources.blob.core.windows.net/carboard-bim-files/duplex.xkt"
            ></input>
            <label className="cb-bim-input-label">BIM Metadata path</label>
            <input
                className="cb-bim-input"
                defaultValue="https://cardboardresources.blob.core.windows.net/carboard-bim-files/duplexMetaModel.json"
            ></input>
            <PrimaryButton onClick={wrappedOnSubmit}>
                Pull from this bim file
            </PrimaryButton>
        </div>
    );
};

export default React.memo(BIMFileSelection);
