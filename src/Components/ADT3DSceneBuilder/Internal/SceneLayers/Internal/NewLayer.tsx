import { Text, TextField } from '@fluentui/react';
import produce from 'immer';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { defaultLayer } from '../../../../../Models/Classes/3DVConfig';
import { createGUID } from '../../../../../Models/Services/Utils';
import { ILayer } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { LayerDialogMode } from '../SceneLayers';
import { sectionHeaderStyles } from '../SceneLayers.styles';
import PrimaryActionCalloutContents from './PrimaryActionCalloutContents';

interface INewLayer {
    onCommitLayer: (layer: ILayer) => void;
    selectedLayer: ILayer;
    mode: LayerDialogMode;
}

const NewLayer: React.FC<INewLayer> = ({
    onCommitLayer,
    selectedLayer,
    mode
}) => {
    const { t } = useTranslation();

    const [layer, setLayer] = useState<ILayer>(
        mode === LayerDialogMode.EditLayer
            ? selectedLayer
            : {
                  ...defaultLayer,
                  id: createGUID()
              }
    );

    return (
        <PrimaryActionCalloutContents
            onPrimaryButtonClick={() => onCommitLayer(layer)}
            primaryButtonText={
                mode === LayerDialogMode.NewLayer
                    ? t('sceneLayers.createNewLayer')
                    : t('sceneLayers.editLayer')
            }
        >
            <TextField
                label={t('sceneLayers.layerName')}
                value={layer.displayName}
                onChange={(_e, newValue) =>
                    setLayer(
                        produce((draft) => {
                            draft.displayName = newValue;
                        })
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
