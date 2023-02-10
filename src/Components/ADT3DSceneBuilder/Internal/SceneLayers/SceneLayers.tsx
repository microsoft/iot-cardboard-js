import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FocusCalloutButton from '../../../FocusCalloutButton/FocusCalloutButton';
import LayersListRoot from './Internal/LayersListRoot';
import NewLayer from './Internal/NewLayer';
import i18n from '../../../../i18n';
import ViewerConfigUtility from '../../../../Models/Classes/ViewerConfigUtility';
import { SceneBuilderContext } from '../../ADT3DSceneBuilder';
import { ILayer } from '../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import ConfirmDeleteDialog from '../ConfirmDeleteDialog/ConfirmDeleteDialog';
import { defaultLayer } from '../../../../Models/Classes/3DVConfig';
import { createGUID } from '../../../../Models/Services/Utils';
import {
    classNamesFunction,
    IFocusTrapZone,
    styled,
    useTheme
} from '@fluentui/react';
import {
    ISceneLayersProps,
    ISceneLayersStyleProps,
    ISceneLayersStyles,
    LayerDialogMode
} from './SceneLayers.types';
import { getStyles } from './SceneLayers.styles';

const getClassNames = classNamesFunction<
    ISceneLayersStyleProps,
    ISceneLayersStyles
>();

const getCalloutTitle = (mode: LayerDialogMode) => {
    switch (mode) {
        case LayerDialogMode.NewLayer:
            return i18n.t('sceneLayers.createNewLayer');
        case LayerDialogMode.EditLayer:
            return i18n.t('sceneLayers.editLayer');
        default:
            return i18n.t('sceneLayers.sceneLayers');
    }
};

const SceneLayers: React.FC<ISceneLayersProps> = (props) => {
    const { styles } = props;

    const { t } = useTranslation();

    const {
        adapter,
        config,
        getConfig,
        setIsLayerBuilderDialogOpen,
        state: { isLayerBuilderDialogOpen, layerBuilderDialogData }
    } = useContext(SceneBuilderContext);

    const [mode, setMode] = useState(LayerDialogMode.Root);
    const [layerDraft, setLayerDraft] = useState<ILayer>(null);
    const [
        confirmDeleteLayerData,
        setConfirmDeleteLayerData
    ] = useState<ILayer>(null);
    const [isLoading, setIsLoading] = useState(false);

    const keepOpenRef = useRef(false);
    const calloutRef = useRef<IFocusTrapZone>(null);

    const classNames = getClassNames(styles, {
        theme: useTheme(),
        isFlyoutOpen: false
    });

    // If behavior Id passed in as data, snap to new layer mode
    useEffect(() => {
        if (isLayerBuilderDialogOpen && layerBuilderDialogData) {
            setLayerDraft({
                ...defaultLayer,
                id: createGUID()
            });
            setMode(LayerDialogMode.NewLayer);
        }
    }, [isLayerBuilderDialogOpen, layerBuilderDialogData]);

    const onCommitLayer = async (layer: ILayer) => {
        let updatedConfig;
        if (mode === LayerDialogMode.NewLayer) {
            updatedConfig = ViewerConfigUtility.createNewLayer(config, layer);
        } else {
            updatedConfig = ViewerConfigUtility.editLayer(config, layer);
        }
        setIsLoading(true);
        await adapter.putScenesConfig(updatedConfig);
        await getConfig();
        setIsLoading(false);
    };

    const onDeleteLayer = async (layer: ILayer) => {
        const updatedConfig = ViewerConfigUtility.deleteLayer(config, layer);
        setIsLoading(true);
        await adapter.putScenesConfig(updatedConfig);
        await getConfig();
        setIsLoading(false);
    };

    return (
        <div>
            <FocusCalloutButton
                buttonText={t('sceneLayers.sceneLayers')}
                calloutTitle={getCalloutTitle(mode)}
                iconName={'MapLayers'}
                isOpen={isLayerBuilderDialogOpen}
                setIsOpen={(isOpen: boolean) => {
                    if (!isOpen && keepOpenRef.current) {
                        return;
                    } else {
                        setMode(LayerDialogMode.Root);
                        setIsLayerBuilderDialogOpen(isOpen);
                    }
                }}
                onBackIconClick={
                    mode !== LayerDialogMode.Root
                        ? () => setMode(LayerDialogMode.Root)
                        : null
                }
                onFocusDismiss={() =>
                    layerBuilderDialogData?.onFocusDismiss?.(layerDraft.id)
                }
                componentRef={calloutRef}
                styles={classNames.subComponentStyles.button}
            >
                {mode === LayerDialogMode.Root && (
                    <LayersListRoot
                        onPrimaryAction={() => {
                            setLayerDraft({
                                ...defaultLayer,
                                id: createGUID()
                            });
                            setMode(LayerDialogMode.NewLayer);
                        }}
                        layers={config?.configuration?.layers || []}
                        onLayerClick={(layer: ILayer) => {
                            setLayerDraft(layer);
                            setMode(LayerDialogMode.EditLayer);
                        }}
                        onDeleteLayerClick={(layer: ILayer) => {
                            keepOpenRef.current = true;
                            setConfirmDeleteLayerData(layer);
                        }}
                        isLoading={isLoading}
                    />
                )}
                {(mode === LayerDialogMode.NewLayer ||
                    mode === LayerDialogMode.EditLayer) &&
                    layerDraft && (
                        <NewLayer
                            onCommitLayer={(layer: ILayer) => {
                                onCommitLayer(layer);
                                setMode(LayerDialogMode.Root);
                                if (layerBuilderDialogData) {
                                    setIsLayerBuilderDialogOpen(false);
                                }
                            }}
                            layerDraft={layerDraft}
                            setLayerDraft={setLayerDraft}
                            mode={mode}
                            behaviors={config.configuration.behaviors}
                        />
                    )}
            </FocusCalloutButton>
            <ConfirmDeleteDialog
                isOpen={!!confirmDeleteLayerData}
                onClose={() => {
                    keepOpenRef.current = false;
                    setConfirmDeleteLayerData(null);
                    calloutRef.current.focus();
                }}
                onConfirm={() => onDeleteLayer(confirmDeleteLayerData)}
                title={t('sceneLayers.deleteConfirmationTitle')}
                message={t('sceneLayers.deleteConfirmationMessage')}
            />
        </div>
    );
};

export default styled<
    ISceneLayersProps,
    ISceneLayersStyleProps,
    ISceneLayersStyles
>(SceneLayers, getStyles);
