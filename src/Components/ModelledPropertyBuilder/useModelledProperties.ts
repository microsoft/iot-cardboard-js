import { useEffect, useMemo, useState } from 'react';
import ViewerConfigUtility from '../../Models/Classes/ViewerConfigUtility';
import { IModelledPropertyBuilderAdapter } from '../../Models/Constants';
import { buildModelledProperties } from './ModelledPropertyBuilder.model';
import {
    BehaviorTwinIdParams,
    IModelledProperties,
    isResolvedTwinIdMode,
    PropertyValueType,
    ResolvedTwinIdParams
} from './ModelledPropertyBuilder.types';

interface IUseModelledPropertiesParams {
    twinIdParams: BehaviorTwinIdParams | ResolvedTwinIdParams;

    /** Network interface with cached DTDL models & ability to resolve twins by Id */
    adapter: IModelledPropertyBuilderAdapter;

    /** List of allowed DTDL primitive types to build value properties for */
    allowedPropertyValueTypes: Array<PropertyValueType>;
}

/**React hook responsible for constructing internal data representation of modelled properties.
 * These modelled properties will update when critical dependencies change.
 * @param IUseModelledPropertiesParams hook parameters
 * @returns nested data structure keyed by primary & alias twin tags at the top level, then nested property names
 * for each tag.  Each value property has an key which represents its path on the twin & a the model for that property.
 */
export const useModelledProperties = ({
    adapter,
    twinIdParams,
    allowedPropertyValueTypes
}: IUseModelledPropertiesParams) => {
    const [isLoading, setIsLoading] = useState(true);
    const [
        modelledProperties,
        setModelledProperties
    ] = useState<IModelledProperties>(null);

    // Gets both primary & aliased twin Ids for a behavior in the context of the current scene.
    const { primaryTwinIds, aliasedTwinMap } = useMemo(
        () =>
            isResolvedTwinIdMode(twinIdParams)
                ? {
                      primaryTwinIds: twinIdParams.primaryTwinIds,
                      aliasedTwinMap: twinIdParams.aliasedTwinMap ?? {}
                  }
                : ViewerConfigUtility.getTwinIdsForBehaviorInScene(
                      twinIdParams.behavior,
                      twinIdParams.config,
                      twinIdParams.sceneId
                  ),
        // Set up refresh dependencies for memoized values
        isResolvedTwinIdMode(twinIdParams)
            ? [twinIdParams.aliasedTwinMap, twinIdParams.primaryTwinIds]
            : [
                  twinIdParams.behavior,
                  twinIdParams.config,
                  twinIdParams.disableAliasedTwins,
                  twinIdParams.sceneId
              ]
    );

    const disableAliasedTwins =
        (isResolvedTwinIdMode(twinIdParams) && !twinIdParams.aliasedTwinMap) ||
        (!isResolvedTwinIdMode(twinIdParams) &&
            twinIdParams.disableAliasedTwins);

    // Merge primary & aliased tags (if enabled) and map twin Ids to model Ids for each twin
    // Update model Id mapping if primary or aliased twins Ids change
    useEffect(() => {
        let isMounted = true;

        const updateModelProperties = async () => {
            setIsLoading(true);
            const modelledProperties = await buildModelledProperties({
                adapter,
                primaryTwinIds,
                ...(!disableAliasedTwins && { aliasedTwinMap }),
                allowedPropertyValueTypes
            });
            if (isMounted) {
                setModelledProperties(modelledProperties);
                setIsLoading(false);
            }
        };
        updateModelProperties();

        // Safely unmount (don't update state post async action)
        return () => {
            isMounted = false;
        };
    }, [primaryTwinIds, aliasedTwinMap]);

    return { isLoading, modelledProperties };
};
