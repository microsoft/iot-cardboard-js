import { ComboBox } from '@fluentui/react';
import React from 'react';
import {
    I3DScenesConfig,
    ILayer
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

interface ISceneLayerMultiSelectBuilder {
    sceneConfig: I3DScenesConfig[];
    behaviorId: string;
    onCreateLayer: (layer: ILayer) => void;
    onSelectedLayersChanged: () => void;
}

const SceneLayerMultiSelectBuilder: React.FC<ISceneLayerMultiSelectBuilder> = ({
    sceneConfig
}) => {
    const selectedLayerIds = [];

    return (
        <ComboBox
            multiSelect
            selectedKey={selectedLayerIds}
            label={'Scene layers'}
        />
    );
};

export default SceneLayerMultiSelectBuilder;
