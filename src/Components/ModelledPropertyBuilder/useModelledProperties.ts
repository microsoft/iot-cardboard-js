import { useEffect, useMemo, useState } from 'react';
import ViewerConfigUtility from '../../Models/Classes/ViewerConfigUtility';
import { IModelledPropertyBuilderAdapter } from '../../Models/Constants';
import {
    IBehavior,
    I3DScenesConfig
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { buildModelledProperties } from './ModelledPropertyBuilder.model';
import {
    PrimitiveType,
    AllowedComplexType
} from './ModelledPropertyBuilder.types';

interface IUseModelledPropertiesParams {
    /** Network interface with cached DTDL models & ability to resolve twins by Id */
    adapter: IModelledPropertyBuilderAdapter;
    /** The behavior to derive primary & aliased Ids from */
    behavior: IBehavior;
    /** The 3D scenes configuration files for accessing elements linked & aliased twins */
    config: I3DScenesConfig;
    /** Active scene context -- used to limit the element matching to the current scene */
    sceneId: string;
    /** List of allowed DTDL primitive types to build value properties for */
    allowedPrimitiveTypes: Array<PrimitiveType>;
    /** List of allowed DTDL complex types to build value properties for */
    allowedComplexTypes: Array<AllowedComplexType>;
    /** List of allowed DTDL complex types to build value properties for */
    disableAliasedTwins: boolean;
}

/**React hook responsible for constructing internal data representation of modelled properties.
 * These modelled properties will update when critical dependencies change.
 * @param IUseModelledPropertiesParams hook parameters
 * @returns nested data structure keyed by primary & alias twin tags at the top level, then nested property names
 * for each tag.  Each value property has an key which represents its path on the twin & a the model for that property.
 */
export const useModelledProperties = ({
    adapter,
    behavior,
    config,
    sceneId,
    allowedPrimitiveTypes,
    allowedComplexTypes,
    disableAliasedTwins
}: IUseModelledPropertiesParams) => {
    const [loading, setIsLoading] = useState(false);
    const [modelledProperties, setModelledProperties] = useState(null);

    // Gets both primary & aliased twin Ids for a behavior in the context of the current scene.
    const { primaryTwinIds, aliasedTwinMap } = useMemo(
        () =>
            ViewerConfigUtility.getTwinIdsForBehaviorInScene(
                behavior,
                config,
                sceneId
            ),
        [behavior, config, sceneId]
    );

    // Merge primary & aliased tags (if enabled) and map twin Ids to model Ids for each twin
    // Update model Id mapping if primary or aliased twins Ids change
    useEffect(() => {
        let isMounted = true;

        const updateModelProperties = async () => {
            const modelledProperties = await buildModelledProperties({
                adapter,
                primaryTwinIds,
                ...(!disableAliasedTwins && { aliasedTwinMap }),
                allowedComplexTypes,
                allowedPrimitiveTypes
            });
            isMounted && setModelledProperties(modelledProperties);
        };
        updateModelProperties();

        // Safely unmount (don't update state post async action)
        return () => {
            isMounted = false;
        };
    }, [adapter, primaryTwinIds, aliasedTwinMap]);

    return null;
};
