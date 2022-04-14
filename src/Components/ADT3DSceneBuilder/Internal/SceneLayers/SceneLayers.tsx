import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FocusCalloutButton from '../../../FocusCalloutButton/FocusCalloutButton';
import LayersListRoot from './Internal/LayersListRoot';
import NewLayer from './Internal/NewLayer';
import i18n from '../../../../i18n';
import ViewerConfigUtility from '../../../../Models/Classes/ViewerConfigUtility';
import { SceneBuilderContext } from '../../ADT3DSceneBuilder';
import { ILayer } from '../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

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
        state: { isLayerBuilderDialogOpen }
    } = useContext(SceneBuilderContext);

    const [mode, setMode] = useState(LayerDialogMode.Root);
    const [selectedLayer, setSelectedLayer] = useState<ILayer>(null);

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

    return (
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
        >
            {mode === LayerDialogMode.Root && (
                <LayersListRoot
                    onPrimaryAction={() => setMode(LayerDialogMode.NewLayer)}
                    layers={config.configuration.layers}
                    onLayerClick={(layer: ILayer) => {
                        setSelectedLayer(layer);
                        setMode(LayerDialogMode.EditLayer);
                    }}
                />
            )}
            {(mode === LayerDialogMode.NewLayer ||
                mode === LayerDialogMode.EditLayer) && (
                <NewLayer
                    onCommitLayer={(layer: ILayer) => {
                        onCommitLayer(layer);
                        setMode(LayerDialogMode.Root);
                    }}
                    selectedLayer={selectedLayer}
                    mode={mode}
                />
            )}
        </FocusCalloutButton>
    );
};

export default SceneLayers;
