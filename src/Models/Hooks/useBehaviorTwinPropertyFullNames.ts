import { useEffect, useState } from 'react';
import { ADTandBlobAdapter, MockAdapter } from '../../Adapters';
import ViewerConfigUtility from '../Classes/ViewerConfigUtility';
import {
    I3DScenesConfig,
    IBehavior,
    ITwinToObjectMapping
} from '../Types/Generated/3DScenesConfiguration-v1.0.0';

interface IUseBehaviorTwinPropertyFullNamesParams {
    behavior: IBehavior;
    isTwinAliasesIncluded: boolean;
    selectedElements?: Array<ITwinToObjectMapping>; // if selected elements passed, retrieve linked or aliased twin properties from selected elements, not elements from current scene in config
    adapter: ADTandBlobAdapter | MockAdapter;
    config: I3DScenesConfig;
    sceneId: string;
}
const useBehaviorTwinPropertyFullNames = ({
    behavior,
    isTwinAliasesIncluded,
    selectedElements,
    adapter,
    config,
    sceneId
}: IUseBehaviorTwinPropertyFullNamesParams) => {
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
    }, [behavior, behavior.datasources, config, sceneId]);
    return { options, isLoading };
};

export default useBehaviorTwinPropertyFullNames;
