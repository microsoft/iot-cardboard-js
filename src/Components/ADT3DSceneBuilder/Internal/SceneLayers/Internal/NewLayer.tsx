import { ITextField, Stack, Text, TextField } from '@fluentui/react';
import produce from 'immer';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
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
    layerDraft: ILayer;
    setLayerDraft: React.Dispatch<React.SetStateAction<ILayer>>;
    mode: LayerDialogMode;
    behaviors: IBehavior[];
    focusReady: boolean;
}

const NewLayer: React.FC<INewLayer> = ({
    onCommitLayer,
    layerDraft,
    setLayerDraft,
    mode,
    behaviors,
    focusReady
}) => {
    const { t } = useTranslation();

    const textFieldRef = useRef<ITextField>(null);

    useEffect(() => {
        if (textFieldRef.current) textFieldRef.current.focus();
    }, [focusReady]);

    const onRemoveBehaviorFromLayer = (behavior: IBehavior) => {
        setLayerDraft(
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

    const behaviorListItems: ICardboardListItem<IBehavior>[] = layerDraft.behaviorIDs.map(
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
            onPrimaryButtonClick={() => onCommitLayer(layerDraft)}
            primaryButtonText={
                mode === LayerDialogMode.NewLayer
                    ? t('sceneLayers.createNewLayer')
                    : t('sceneLayers.confirmChanges')
            }
            disablePrimaryButton={layerDraft.displayName === ''}
        >
            <Stack tokens={{ childrenGap: 12 }}>
                <TextField
                    label={t('sceneLayers.layerName')}
                    value={layerDraft.displayName}
                    onChange={(_e, newValue) =>
                        setLayerDraft(
                            produce((draft) => {
                                draft.displayName = newValue;
                            })
                        )
                    }
                    styles={{ root: { marginBottom: 8 } }}
                    placeholder={t('sceneLayers.layerNamePlaceholder')}
                    componentRef={textFieldRef}
                />
                {layerDraft.behaviorIDs.length > 0 ? (
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
