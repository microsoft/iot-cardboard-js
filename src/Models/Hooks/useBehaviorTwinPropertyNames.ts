import { useContext, useEffect, useState } from 'react';
import { SceneBuilderContext } from '../../Components/ADT3DSceneBuilder/ADT3DSceneBuilder';
import { IBehavior } from '../Types/Generated/3DScenesConfiguration-v1.0.0';

interface IUseBehaviorTwinPropertyNamesParams {
    behavior: IBehavior;
    isFullName?: boolean;
    isTwinAliasesIncluded?: boolean;
}
const useBehaviorTwinPropertyNames = ({
    behavior,
    isFullName = true,
    isTwinAliasesIncluded = true
}: IUseBehaviorTwinPropertyNamesParams) => {
    const { config, sceneId, adapter } = useContext(SceneBuilderContext);
    const [options, setOptions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setIsLoading(true);
        const getPropertiesPromise = isFullName
            ? adapter.getTwinPropertiesForBehaviorWithFullName(
                  sceneId,
                  config,
                  behavior,
                  isTwinAliasesIncluded
              )
            : adapter.getTwinPropertiesForBehavior(
                  sceneId,
                  config,
                  behavior,
                  isTwinAliasesIncluded
              );
        getPropertiesPromise.then((properties) => {
            setIsLoading(false);
            if (properties?.length) {
                setOptions(properties);
            }
        });
    }, [behavior, behavior.datasources, config, sceneId]);
    return { options, isLoading };
};

export default useBehaviorTwinPropertyNames;
