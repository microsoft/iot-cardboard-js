import {
    ActionButton,
    ComboBox,
    IComboBox,
    IComboBoxOption
} from '@fluentui/react';
import React, { useContext } from 'react';
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
        event: React.FormEvent<IComboBox>,
        option: IComboBoxOption,
        _index?: number,
        _value?: string
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
            label={t('sceneLayers.noneSelected')}
            options={layerOptions}
            useComboBoxAsMenuWidth
            onChange={onSelectedLayerChanges}
            placeholder={t('sceneLayers.noneSelected')}
            onRenderLowerContent={() => (
                <div>
                    <ActionButton
                        iconProps={{ iconName: 'Add' }}
                        onClick={() => {
                            setIsLayerBuilderDialogOpen(true, behaviorId);
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
