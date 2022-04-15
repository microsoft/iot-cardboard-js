import React, { useContext, useEffect, useState } from 'react';
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

interface ISceneLayersProps {
    test?: boolean;
}

export enum LayerDialogMode {
    Root = 'root',
    NewLayer = 'newLayer',
    EditLayer = 'editLayer'
}

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

const SceneLayers: React.FC<ISceneLayersProps> = () => {
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
    const [focusLayerMounted, setFocusLayerMounted] = useState(false);
    const [
        confirmDeleteLayerData,
        setConfirmDeleteLayerData
    ] = useState<ILayer>(null);

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

        await adapter.putScenesConfig(updatedConfig);
        getConfig();
    };

    const onDeleteLayer = async (layer: ILayer) => {
        const updatedConfig = ViewerConfigUtility.deleteLayer(config, layer);
        await adapter.putScenesConfig(updatedConfig);
        getConfig();
    };

    return (
        <>
            <FocusCalloutButton
                buttonText={t('sceneLayers.sceneLayers')}
                calloutTitle={getCalloutTitle(mode)}
                iconName="Stack"
                isOpen={isLayerBuilderDialogOpen}
                setIsOpen={(isOpen: boolean) => {
                    setMode(LayerDialogMode.Root);
                    setIsLayerBuilderDialogOpen(isOpen);
                }}
                onBackIconClick={
                    mode !== LayerDialogMode.Root
                        ? () => setMode(LayerDialogMode.Root)
                        : null
                }
                onFocusLayerMounted={() => setFocusLayerMounted(true)}
                onFocusDismiss={() =>
                    layerBuilderDialogData?.onFocusDismiss?.(layerDraft.id)
                }
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
                        layers={config.configuration.layers}
                        onLayerClick={(layer: ILayer) => {
                            setLayerDraft(layer);
                            setMode(LayerDialogMode.EditLayer);
                        }}
                        onDeleteLayerClick={(layer: ILayer) =>
                            setConfirmDeleteLayerData(layer)
                        }
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
                            focusReady={focusLayerMounted}
                        />
                    )}
            </FocusCalloutButton>
            <ConfirmDeleteDialog
                isOpen={!!confirmDeleteLayerData}
                onClose={() => {
                    setConfirmDeleteLayerData(null);
                }}
                onConfirmDeletion={() => onDeleteLayer(confirmDeleteLayerData)}
            />
        </>
    );
};

export default SceneLayers;
