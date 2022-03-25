import { useContext, useEffect, useState } from 'react';
import { SceneBuilderContext } from '../../Components/ADT3DSceneBuilder/ADT3DSceneBuilder';
import { IBehavior } from '../Types/Generated/3DScenesConfiguration-v1.0.0';

interface IUseBehaviorTwinPropertyNamesParams {
    behavior: IBehavior;
}
const useBehaviorTwinPropertyNames = ({
    behavior
}: IUseBehaviorTwinPropertyNamesParams) => {
    const { config, sceneId, adapter } = useContext(SceneBuilderContext);
    const [options, setOptions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setIsLoading(true);
        adapter
            .getTwinPropertiesForBehaviorWithFullName(sceneId, config, behavior)
            .then((properties) => {
                setIsLoading(false);
                if (properties?.length) {
                    setOptions(properties);
                }
            });
    }, [behavior, behavior.datasources, config, sceneId]);
    return { options, isLoading };
};

export default useBehaviorTwinPropertyNames;
