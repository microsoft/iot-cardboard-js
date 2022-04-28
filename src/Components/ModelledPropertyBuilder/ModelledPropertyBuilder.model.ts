import { DtdlInterface } from '../../Models/Constants/dtdlInterfaces';
import {
    AllowedComplexType,
    PrimitiveType
} from './ModelledPropertyBuilder.types';

interface IBuildModelledPropertiesParams {
    models: DtdlInterface[];
    primaryTwinIds: string[];
    aliasedTwinMap?: Record<string, string>;
    allowedPrimitiveTypes: Array<PrimitiveType>;
    allowedComplexTypes: Array<AllowedComplexType>;
}

/**
 * Builds internal data representation for modelled properties
 * @param models Exhaustive list of all DTDL models in environment
 * @param primaryTwinIds Array of twin Ids to find modelelled properties for
 * @param primaryTwinTag tag for the primary twin
 * @param aliasedTwinMap Optional map of alias to twinIds mappings.
 * @param allowedPrimitiveTypes List of allowed DTDL primitive types to build value properties for
 * @param allowedComplexTypes List of allowed DTDL complex types to build value properties for
 * @returns nested data structure keyed by primary & alias twin tags at the top level, then nested property names
 * for each tag.  Each value property has an key which represents its path on the twin & a the model for that property.
 */
export const buildModelledProperties = ({
    models,
    primaryTwinIds,
    aliasedTwinMap,
    allowedPrimitiveTypes,
    allowedComplexTypes
}: IBuildModelledPropertiesParams) => {
    // Merge LinkedTwin & aliased twins (if present) into tag: id mapping.
};
