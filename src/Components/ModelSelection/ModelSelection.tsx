import React from 'react';

import { Checkbox, PrimaryButton } from '@fluentui/react';
import { IModelSelectionProps } from '../../Models/Constants';
import './ModelSelection.scss';

const ModelSelection: React.FC<IModelSelectionProps> = ({
    models,
    onSubmit
}) => {
    return (
        <div className="cb-model-selection-container">
            <div className="cb-checkbox-container">
                {!!models &&
                    models.map((model, modelI) => (
                        <Checkbox
                            label={model}
                            className="cb-model-checkbox"
                            defaultChecked={true}
                            key={modelI}
                        ></Checkbox>
                    ))}
            </div>
            <PrimaryButton
                onClick={() => onSubmit(models)}
                className={'cb-upload-button'}
            >
                upload
            </PrimaryButton>
        </div>
    );
};

export default React.memo(ModelSelection);
