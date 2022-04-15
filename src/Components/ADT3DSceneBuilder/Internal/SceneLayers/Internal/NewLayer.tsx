import { Stack, Text, TextField } from '@fluentui/react';
import produce from 'immer';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { defaultLayer } from '../../../../../Models/Classes/3DVConfig';
import { createGUID } from '../../../../../Models/Services/Utils';
import {
    IBehavior,
    ILayer
} from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { CardboardList } from '../../../../CardboardList';
import { ICardboardListItem } from '../../../../CardboardList/CardboardList.types';
import { LayerDialogMode } from '../SceneLayers';
import { sectionHeaderStyles } from '../SceneLayers.styles';
import PrimaryActionCalloutContents from './PrimaryActionCalloutContents';

interface INewLayer {
    onCommitLayer: (layer: ILayer) => void;
    selectedLayer: ILayer;
    mode: LayerDialogMode;
    behaviors: IBehavior[];
}

const NewLayer: React.FC<INewLayer> = ({
    onCommitLayer,
    selectedLayer,
    mode,
    behaviors
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

    const onRemoveBehaviorFromLayer = (behavior: IBehavior) => {
        setLayer(
            produce((draft) => {
                const behaviorIdIdxToRemove = draft.behaviorIDs.findIndex(
                    (id) => id === behavior.id
                );
                if (behaviorIdIdxToRemove !== -1) {
                    draft.behaviorIDs.splice(behaviorIdIdxToRemove, 1);
                }
            })
        );
    };

    const behaviorListItems: ICardboardListItem<IBehavior>[] = layer.behaviorIDs.map(
        (behaviorId) => {
            const behavior = behaviors.find((b) => b.id === behaviorId);
            return {
                ariaLabel: behavior.displayName,
                textPrimary: behavior.displayName,
                item: behavior,
                onClick: () => null,
                iconEnd: {
                    name: 'Delete',
                    onClick: () => onRemoveBehaviorFromLayer(behavior)
                }
            };
        }
    );

    return (
        <PrimaryActionCalloutContents
            onPrimaryButtonClick={() => onCommitLayer(layer)}
            primaryButtonText={
                mode === LayerDialogMode.NewLayer
                    ? t('sceneLayers.createNewLayer')
                    : t('sceneLayers.confirmChanges')
            }
        >
            <Stack tokens={{ childrenGap: 12 }}>
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
                    placeholder={t('sceneLayers.layerNamePlaceholder')}
                    autoFocus
                />
                {layer.behaviorIDs.length > 0 ? (
                    <div>
                        <Text variant="medium" styles={sectionHeaderStyles}>
                            {t('sceneLayers.behaviorsOnThisLayer')}
                        </Text>
                        <CardboardList
                            items={behaviorListItems}
                            listKey="behavior"
                        />
                    </div>
                ) : mode === LayerDialogMode.EditLayer ? (
                    <Text variant="medium">
                        {t('sceneLayers.noBehaviorsOnLayer')}
                    </Text>
                ) : null}
            </Stack>
        </PrimaryActionCalloutContents>
    );
};

export default NewLayer;
