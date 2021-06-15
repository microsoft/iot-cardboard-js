import React, { useCallback, useEffect, useState } from 'react';
import { IBIMFileSelectionProps } from '../../Models/Constants';
import './BIMFileSelection.scss';

const BIMViewer: React.FC<IBIMFileSelectionProps> = ({ onSubmit }) => {
    const wrappedOnSubmit = useCallback(() => {
        onSubmit('TODO bim file path', 'TODO metadata file path');
    }, [onSubmit]);

    return (
        <div className="cb-bim-file-selection-container">
            <input></input>
            <input></input>
            <button onClick={wrappedOnSubmit}>pull from this bim file</button>
        </div>
    );
};

export default React.memo(BIMViewer);
