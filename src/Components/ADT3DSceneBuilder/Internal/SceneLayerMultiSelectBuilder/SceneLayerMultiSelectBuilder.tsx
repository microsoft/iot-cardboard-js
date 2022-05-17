import {
    ActionButton,
    Callout,
    ComboBox,
    DirectionalHint,
    IComboBox,
    IComboBoxOption,
    IComboBoxProps,
    IconButton,
    IOnRenderComboBoxLabelProps,
    Label,
    Stack,
    useTheme
} from '@fluentui/react';
import { useBoolean, useId } from '@fluentui/react-hooks';
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

    const onRenderLabel = (
        renderProps: IOnRenderComboBoxLabelProps
    ): JSX.Element => {
        return (
            <Stack horizontal verticalAlign={'center'}>
                <Label>{renderProps.props.label}</Label>
                <InfoCallout />
            </Stack>
        );
    };

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

const InfoCallout: React.FC = () => {
    // state
    const [flyoutVisible, { toggle: toggleFlyout }] = useBoolean(false);

    // hooks
    const id = useId();
    const { t } = useTranslation();
    const theme = useTheme();

    return (
        <>
            <IconButton
                ariaLabel={t('sceneLayers.infoCalloutButtonTitle')}
                id={id}
                iconProps={{ iconName: 'Info' }}
                // onClick={toggleFlyout}
                onFocus={toggleFlyout}
                onBlur={toggleFlyout}
                onMouseEnter={toggleFlyout}
                onMouseLeave={toggleFlyout}
                styles={{
                    root: {
                        marginBottom: -3,
                        color: theme.semanticColors.bodyText
                    }
                }}
                title={t('sceneLayers.infoCalloutButtonTitle')}
            />
            {flyoutVisible && (
                <Callout
                    target={`#${id}`}
                    directionalHint={DirectionalHint.rightCenter}
                    onDismiss={toggleFlyout}
                    styles={{
                        root: {
                            maxWidth: 300,
                            padding: 8
                        }
                    }}
                >
                    {t('sceneLayers.infoCalloutContent')}
                </Callout>
            )}
        </>
    );
};

export default SceneLayerMultiSelectBuilder;
