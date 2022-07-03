import {
    ActionButton,
    ComboBox,
    IComboBox,
    IComboBoxOption,
    IOnRenderComboBoxLabelProps,
    Label,
    Stack
} from '@fluentui/react';
import React, { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import TooltipCallout from '../../../TooltipCallout/TooltipCallout';
import { SceneBuilderContext } from '../../ADT3DSceneBuilder';

interface ISceneLayerMultiSelectBuilder {
    behaviorId: string;
    selectedLayerIds: string[];
    onLayerSelected: (layerId: string) => void;
    onLayerUnselected: (layerId: string) => void;
}

const SceneLayerMultiSelectBuilder: React.FC<ISceneLayerMultiSelectBuilder> = ({
    behaviorId,
    selectedLayerIds,
    onLayerSelected,
    onLayerUnselected
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

    const onRenderLabel = (
        renderProps: IOnRenderComboBoxLabelProps
    ): JSX.Element => {
        return (
            <Stack horizontal verticalAlign={'center'}>
                <Label>{renderProps.props.label}</Label>
                <TooltipCallout
                    content={{
                        buttonAriaLabel: t('sceneLayers.infoCalloutContent'),
                        calloutContent: t('sceneLayers.infoCalloutContent')
                    }}
                />
            </Stack>
        );
    };

    const onSelectedLayerChanges = (
        _event: React.FormEvent<IComboBox>,
        option: IComboBoxOption
    ) => {
        const selected = option.selected;

        if (option) {
            if (selected) {
                onLayerSelected(option.key as string);
            } else {
                onLayerUnselected(option.key as string);
            }
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
            onRenderLabel={onRenderLabel}
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
                                    onLayerSelected(layerId);
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
