import { DtdlProperty } from '../../Models/Constants/dtdlInterfaces';
import { IModelledPropertyBuilderAdapter } from '../../Models/Constants/Interfaces';
import {
    I3DScenesConfig,
    IBehavior
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

export type ModelledPropertyBuilderMode =
    | 'PROPERTY_SELECTION'
    | 'INTELLISENSE'
    | 'TOGGLE';

export interface ModelledPropertyBuilderProps {
    /** Adapter with necessary methods for accessing DTDL models & resolving twins */
    adapter: IModelledPropertyBuilderAdapter;

    /** The behavior to derive primary & aliased Ids from */
    behavior: IBehavior;

    /** The 3D scenes configuration files for accessing elements linked & aliased twins */
    config: I3DScenesConfig;

    /** The active scene context -- used to limit the element matching to the current scene */
    sceneId: string;

    /** Optional flag to disable inclusion of twin aliases (default to false) */
    disableAliasedTwins?: boolean;

    /** 
		This is a controlled component which lets consumer store the
		currently selected property or expression.  This also allows
		the state to be initialized in edit form modes.
	*/
    selectedPropertyOrExpression: PropertyOrExpression;

    /** Configuration for supported modes */
    mode: 'PROPERTY_SELECTION' | 'INTELLISENSE' | 'TOGGLE';

    /** 
		Allows consumer to only allow specific property primitive types.
		Defaults to all primitive types.
	*/
    allowedPrimitiveTypes?: Array<PrimitiveType>;

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

export type PrimitiveType =
    | 'boolean'
    | 'date'
    | 'dateTime'
    | 'double'
    | 'duration'
    | 'float'
    | 'integer'
    | 'long'
    | 'string'
    | 'time';

export type AllowedComplexType = 'Enum' | 'Object';

export const defaultAllowedPrimitiveTypes: PrimitiveType[] = [
    'boolean',
    'date',
    'dateTime',
    'double',
    'duration',
    'float',
    'integer',
    'long',
    'string',
    'time'
];

export const defaultAllowedComplexTypes: AllowedComplexType[] = [
    'Enum',
    'Object'
];
