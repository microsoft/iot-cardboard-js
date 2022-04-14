import { ILayer, Text, TextField } from '@fluentui/react';
import produce from 'immer';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { defaultLayer } from '../../../Models/Classes/3DVConfig';
import { createGUID } from '../../../Models/Services/Utils';
import { sectionHeaderStyles } from '../SceneLayers.styles';
import PrimaryActionCalloutContents from './PrimaryActionCalloutContents';

interface INewLayer {
    onCreateLayer: (layer: ILayer) => void;
}

const NewLayer: React.FC<INewLayer> = ({ onCreateLayer }) => {
    const { t } = useTranslation();

    const [newLayer, setNewLayer] = useState({
        ...defaultLayer,
        id: createGUID()
    });

    return (
        <PrimaryActionCalloutContents
            onPrimaryButtonClick={() => onCreateLayer(newLayer)}
            primaryButtonText={t('sceneLayers.createNewLayer')}
        >
            <TextField
                label={t('sceneLayers.layerName')}
                value={newLayer.displayName}
                onChange={(_e, newValue) =>
                    setNewLayer(
                        produce((draft) => (draft.displayName = newValue))
                    )
                }
                styles={{ root: { marginBottom: 8 } }}
            />
            <Text variant="medium" styles={sectionHeaderStyles}>
                {t('sceneLayers.behaviorsOnThisLayer')}
            </Text>
        </PrimaryActionCalloutContents>
    );
};

export default NewLayer;
