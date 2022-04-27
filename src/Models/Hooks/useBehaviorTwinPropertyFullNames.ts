import { useContext, useEffect, useState } from 'react';
import { SceneBuilderContext } from '../../Components/ADT3DSceneBuilder/ADT3DSceneBuilder';
import ViewerConfigUtility from '../Classes/ViewerConfigUtility';
import {
    IBehavior,
    ITwinToObjectMapping
} from '../Types/Generated/3DScenesConfiguration-v1.0.0';

interface IUseBehaviorTwinPropertyFullNamesParams {
    behavior: IBehavior;
    isTwinAliasesIncluded: boolean;
    selectedElements?: Array<ITwinToObjectMapping>; // if selected elements passed, retrieve linked or aliased twin properties from selected elements, not elements from current scene in config
}
const useBehaviorTwinPropertyFullNames = ({
    behavior,
    isTwinAliasesIncluded,
    selectedElements
}: IUseBehaviorTwinPropertyFullNamesParams) => {
    const { config, sceneId, adapter } = useContext(SceneBuilderContext);
    const [options, setOptions] = useState<Array<string>>([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setIsLoading(true);
        const elementsInBehavior =
            selectedElements ??
            ViewerConfigUtility.getElementsInScene(config, sceneId);
        adapter
            .getTwinPropertiesForBehaviorWithFullName(
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
    }, [
        adapter,
        behavior,
        behavior.datasources,
        config,
        isTwinAliasesIncluded,
        sceneId,
        selectedElements
    ]);
    return { options, isLoading };
};

export default useBehaviorTwinPropertyFullNames;
