import { useContext, useEffect, useState } from 'react';
import { SceneBuilderContext } from '../../Components/ADT3DSceneBuilder/ADT3DSceneBuilder';
import { IAliasedTwinProperty } from '../Constants/Interfaces';
import { IBehavior } from '../Types/Generated/3DScenesConfiguration-v1.0.0';

interface IUseBehaviorAliasedTwinProperties {
    behavior: IBehavior;
    isTwinAliasesIncluded: boolean;
}
const useBehaviorAliasedTwinProperties = ({
    behavior,
    isTwinAliasesIncluded
}: IUseBehaviorAliasedTwinProperties) => {
    const { config, sceneId, adapter } = useContext(SceneBuilderContext);
    const [options, setOptions] = useState<Array<IAliasedTwinProperty>>([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setIsLoading(true);
        adapter
            .getTwinPropertiesWithAliasesForBehavior(
                sceneId,
                config,
                behavior,
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
