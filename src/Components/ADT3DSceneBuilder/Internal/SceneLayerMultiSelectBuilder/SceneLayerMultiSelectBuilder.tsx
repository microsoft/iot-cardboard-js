import { ComboBox, IComboBoxOption } from '@fluentui/react';
import React, { useContext } from 'react';
import ViewerConfigUtility from '../../../../Models/Classes/ViewerConfigUtility';
import { SceneBuilderContext } from '../../ADT3DSceneBuilder';

interface ISceneLayerMultiSelectBuilder {
    behaviorId: string;
}

const SceneLayerMultiSelectBuilder: React.FC<ISceneLayerMultiSelectBuilder> = ({
    behaviorId
}) => {
    const { config } = useContext(SceneBuilderContext);

    const layerOptions: IComboBoxOption[] = config.configuration.layers.map(
        (layer) => ({
            key: layer.id,
            text: layer.displayName
        })
    );
    const selectedLayerIds = ViewerConfigUtility.getActiveLayersForBehavior(
        config,
        behaviorId
    );

    return (
        <ComboBox
            multiSelect
            selectedKey={selectedLayerIds}
            label={'Scene layers'}
            options={layerOptions}
            useComboBoxAsMenuWidth
        />
    );
};

export default SceneLayerMultiSelectBuilder;
