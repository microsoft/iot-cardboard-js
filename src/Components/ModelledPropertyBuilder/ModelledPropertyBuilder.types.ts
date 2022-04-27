// TODO -- remove eslint overrides if not using

import { DTDLPrimitiveSchema } from '../../Models/Classes/DTDL';
import { IModelledPropertyBuilderAdapter } from '../../Models/Constants';
import { DtdlProperty } from '../../Models/Constants/dtdlInterfaces';

export interface ModelledPropertyBuilderProps {
    /** Adapter with set of all cached models */
    adapter: IModelledPropertyBuilderAdapter;

    /** Array of twin Ids to find modelelled properties for */
    primaryTwinIds: string[];

    /** Optional tag for the primary twin, defaults to 'LinkedTwin' */
    primaryTwinTag?: string;

    /** 
		This is a controlled component which lets consumer store the
		currently selected property or expression.  This also allows
		the state to be initialized in edit form modes.
	*/
    selectedPropertyOrExpression: PropertyOrExpression;

    /** 
		Optional map of alias to twinIds mappings.
		If present, the modelled properties for each aliased
		twinId will be merged with the output.
	*/
    aliasedTwinMap?: Record<string, string>;

    /** Configuration for supported modes */
    mode: 'PROPERTY_SELECTION' | 'INTELLISENSE' | 'TOGGLE';

    /** 
		Allows consumer to only allow specific property primitive types.
		Defaults to all primitive types.
	*/
    allowedPrimitiveTypes?: Array<DTDLPrimitiveSchema>;

    /** 
		Allows consumer to only allow specific complex property types
		Defaults to ['Object', 'Enum'] (Maps & Arrays will only be supported via plaintext)
	*/
    allowedComplexTypes?: Array<AllowedComplexType>;

    /** 
			Reports back property or expression to consuming component when changed.
			
			If in PROPERTY_SELECTION mode, the property path & model are reported.
			allowing components such as the property widget builder to
			use information about the properties model.

			If in INTELLISENSE mode, the string expression is reported.
	  */
    onChange: (newPropertyOrExpression: PropertyOrExpression) => void;
}

export type AllowedComplexType = 'Enum' | 'Object';

export type PropertyOrExpression =
    | {
          propertyPath: string;
          type: 'property';
          propertyModel: DtdlProperty;
      }
    | {
          expression: string;
          type: 'expression';
      };
