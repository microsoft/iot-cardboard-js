import { useMemo, useState } from 'react';
import ViewerConfigUtility from '../../Models/Classes/ViewerConfigUtility';
import {
    IModelledPropertyBuilderAdapter,
    PropertyValueType
} from '../../Models/Constants';
import { buildModelledProperties } from './ModelledPropertyBuilder.model';
import useDeepCompareEffect from 'use-deep-compare-effect';
import {
    BehaviorTwinIdParams,
    IModelledProperties,
    isResolvedTwinIdMode,
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
    const twinIds = useMemo(() => {
        if (isResolvedTwinIdMode(twinIdParams)) {
            return {
                primaryTwinIds: twinIdParams.primaryTwinIds,
                aliasedTwinMap: twinIdParams.aliasedTwinMap ?? {}
            };
        } else {
            // Create a snapshot of the edited config by commiting the alias & behavior changes
            // To a new object. Use this to derive the latest alias ID info from the un-commited behavior
            // This mocks the same functionality as commiting the changes to a behavior
            // Note -- because of the complexity of this, it may be worth storing a draft config in state and
            // using that config rather than applying different sets of changes to the config on behavior update
            const draftConfigSnapshot = ViewerConfigUtility.copyConfigWithBehaviorAndElementEditsApplied(
                twinIdParams.config,
                twinIdParams.behavior,
                twinIdParams.selectedElements,
                twinIdParams.sceneId
            );

            return ViewerConfigUtility.getTwinIdsForBehaviorInScene(
                twinIdParams.behavior,
                draftConfigSnapshot,
                twinIdParams.sceneId
            );
        }
    }, [twinIdParams]);

    const disableAliasedTwins =
        (isResolvedTwinIdMode(twinIdParams) && !twinIdParams.aliasedTwinMap) ||
        (!isResolvedTwinIdMode(twinIdParams) &&
            twinIdParams.disableAliasedTwins);

    // Merge primary & aliased tags (if enabled) and map twin Ids to model Ids for each twin
    // Update model Id mapping if primary or aliased twins Ids change
    useDeepCompareEffect(() => {
        let isMounted = true;

        const updateModelProperties = async () => {
            setIsLoading(true);
            const modelledProperties = await buildModelledProperties({
                adapter,
                primaryTwinIds: twinIds.primaryTwinIds,
                ...(!disableAliasedTwins && {
                    aliasedTwinMap: twinIds.aliasedTwinMap
                }),
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
    }, [twinIds.primaryTwinIds, twinIds.aliasedTwinMap]);

    return { isLoading, modelledProperties };
};
