import { useContext, useEffect, useState } from 'react';
import { SceneBuilderContext } from '../../Components/ADT3DSceneBuilder/ADT3DSceneBuilder';
import ViewerConfigUtility from '../Classes/ViewerConfigUtility';
import { IAliasedTwinProperty } from '../Constants/Interfaces';
import {
    IBehavior,
    ITwinToObjectMapping
} from '../Types/Generated/3DScenesConfiguration-v1.0.0';

interface IUseBehaviorAliasedTwinProperties {
    behavior: IBehavior;
    isTwinAliasesIncluded: boolean;
    selectedElements?: Array<ITwinToObjectMapping>; // if selected elements passed, retrieve linked or aliased twin properties from selected elements, not elements from current scene in config
}
const useBehaviorAliasedTwinProperties = ({
    behavior,
    isTwinAliasesIncluded,
    selectedElements
}: IUseBehaviorAliasedTwinProperties) => {
    const { config, sceneId, adapter } = useContext(SceneBuilderContext);
    const [options, setOptions] = useState<Array<IAliasedTwinProperty>>([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setIsLoading(true);
        const elementsInBehavior =
            selectedElements ??
            ViewerConfigUtility.getElementsInScene(config, sceneId);
        adapter
            .getTwinPropertiesWithAliasesForBehavior(
                behavior,
                elementsInBehavior,
                isTwinAliasesIncluded
            )
            .then((properties) => {
                setIsLoading(false);
                if (properties?.length) {
                    setOptions(properties);
                }
            });
    }, [behavior, behavior.datasources, config, sceneId]);
    return { options, isLoading };
};

export default useBehaviorAliasedTwinProperties;
