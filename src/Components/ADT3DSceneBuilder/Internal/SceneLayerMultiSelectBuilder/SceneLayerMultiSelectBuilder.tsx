import {
    ActionButton,
    ComboBox,
    IComboBox,
    IComboBoxOption
} from '@fluentui/react';
import produce from 'immer';
import React, { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SceneBuilderContext } from '../../ADT3DSceneBuilder';

interface ISceneLayerMultiSelectBuilder {
    behaviorId: string;
    selectedLayerIds: string[];
    setSelectedLayerIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const SceneLayerMultiSelectBuilder: React.FC<ISceneLayerMultiSelectBuilder> = ({
    behaviorId,
    selectedLayerIds,
    setSelectedLayerIds
}) => {
    const { t } = useTranslation();

    const comboBoxRef = useRef<IComboBox>(null);

    const { config, setIsLayerBuilderDialogOpen } = useContext(
        SceneBuilderContext
    );

    const layerOptions: IComboBoxOption[] = config.configuration.layers.map(
        (layer) => ({
            key: layer.id,
            text: layer.displayName
        })
    );

    const onSelectedLayerChanges = (
        _event: React.FormEvent<IComboBox>,
        option: IComboBoxOption
    ) => {
        const selected = option.selected;

        if (option) {
            setSelectedLayerIds((prevSelectedKeys) =>
                selected
                    ? [...prevSelectedKeys, option.key as string]
                    : prevSelectedKeys.filter((k) => k !== option.key)
            );
        }
    };

    return (
        <ComboBox
            multiSelect
            selectedKey={selectedLayerIds}
            label={t('sceneLayers.sceneLayers')}
            options={layerOptions}
            useComboBoxAsMenuWidth
            onChange={onSelectedLayerChanges}
            placeholder={t('sceneLayers.noneSelected')}
            componentRef={comboBoxRef}
            onRenderLowerContent={() => (
                <div>
                    <ActionButton
                        iconProps={{ iconName: 'Add' }}
                        onClick={() => {
                            setIsLayerBuilderDialogOpen(
                                true,
                                behaviorId,
                                (layerId: string) => {
                                    comboBoxRef.current.focus(true);
                                    setSelectedLayerIds(
                                        produce((draft) => {
                                            draft.push(layerId);
                                        })
                                    );
                                }
                            );
                        }}
                    >
                        {t('sceneLayers.createNewLayer')}
                    </ActionButton>
                </div>
            )}
        />
    );
};

export default SceneLayerMultiSelectBuilder;
