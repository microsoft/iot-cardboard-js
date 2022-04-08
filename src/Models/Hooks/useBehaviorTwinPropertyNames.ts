import { useContext, useEffect, useState } from 'react';
import { SceneBuilderContext } from '../../Components/ADT3DSceneBuilder/ADT3DSceneBuilder';
import { IAliasedTwinProperty } from '../Constants/Interfaces';
import { IBehavior } from '../Types/Generated/3DScenesConfiguration-v1.0.0';

interface IUseBehaviorTwinPropertyNamesParams {
    behavior: IBehavior;
    isFullName: boolean; // if the property name in return should be prefixed by its alias, e.g "LinkedTwin.Temperature" or "SpeedTag.Speed" if it is from twin alias as opposed to "Temperature" or "Speed" alone
    isTwinAliasesIncluded: boolean;
}
const useBehaviorTwinPropertyNames = ({
    behavior,
    isFullName,
    isTwinAliasesIncluded
}: IUseBehaviorTwinPropertyNamesParams) => {
    const { config, sceneId, adapter } = useContext(SceneBuilderContext);
    const [options, setOptions] = useState<
        Array<string | IAliasedTwinProperty>
    >([]);
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
            : adapter.getTwinPropertiesWithAliasesForBehavior(
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
