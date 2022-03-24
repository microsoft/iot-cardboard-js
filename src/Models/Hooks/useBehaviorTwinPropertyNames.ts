import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SceneBuilderContext } from '../../Components/ADT3DSceneBuilder/ADT3DSceneBuilder';
import { IBehavior } from '../Types/Generated/3DScenesConfiguration-v1.0.0';

interface IUseBehaviorTwinPropertyNamesParams {
    behavior: IBehavior;
    emptyItemLocKey?: string;
}
const useBehaviorTwinPropertyNames = ({
    behavior,
    emptyItemLocKey
}: IUseBehaviorTwinPropertyNamesParams) => {
    const { t } = useTranslation();
    const { config, sceneId, adapter } = useContext(SceneBuilderContext);
    const [options, setOptions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        adapter
            .getTwinPropertiesForBehaviorWithFullName(sceneId, config, behavior)
            .then((properties) => {
                setIsLoading(false);
                if (properties?.length) {
                    // add an empty entry to the start of the list
                    emptyItemLocKey && properties.unshift(t(emptyItemLocKey));
                    setOptions(properties);
                }
            });
    }, [behavior, behavior.datasources, config, sceneId]);
    return { options, isLoading };
};

export default useBehaviorTwinPropertyNames;
