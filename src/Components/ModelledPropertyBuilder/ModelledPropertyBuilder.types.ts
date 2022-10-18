import { PRIMARY_TWIN_NAME, PropertyValueType } from '../../Models/Constants';
import { IModelledPropertyBuilderAdapter } from '../../Models/Constants/Interfaces';
import {
    I3DScenesConfig,
    IBehavior,
    ITwinToObjectMapping
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { ITooltipCalloutContent } from '../TooltipCallout/TooltipCallout.types';

export enum ModelledPropertyBuilderMode {
    PROPERTY_SELECT = 'PROPERTY_SELECTION',
    INTELLISENSE = 'INTELLISENSE',
    TOGGLE = 'TOGGLE'
}

export interface BehaviorTwinIdParams {
    /** The behavior to derive primary & aliased Ids from */
    behavior: IBehavior;

    /** The 3D scenes configuration files for accessing elements primary & aliased twins */
    config: I3DScenesConfig;

    /** The active scene context -- used to limit the element matching to the current scene */
    sceneId: string;

    /** Currently selected elements (these elements include latest alias ID data) */
    selectedElements: ITwinToObjectMapping[];

    /** Optional flag to disable inclusion of twin aliases (default to false) */
    disableAliasedTwins?: boolean;
}

export interface ResolvedTwinIdParams {
    /** Array of twin Ids to find modelelled properties for */
    primaryTwinIds: string[];

    /** Optional map of alias to twinIds mappings. */
    aliasedTwinMap?: Record<string, string[]>;
}

export interface ModelledPropertyBuilderProps {
    /** Adapter with necessary methods for accessing DTDL models & resolving twins */
    adapter: IModelledPropertyBuilderAdapter;

    /** description of the field to show below the input */
    description?: string;

    /** Params for deriving primary & aliased twin Ids */
    twinIdParams: BehaviorTwinIdParams | ResolvedTwinIdParams;

    /** 
		This is a controlled component which lets consumer store the
		currently selected property or expression.  This also allows
		the state to be initialized in edit form modes.
	*/
    propertyExpression: PropertyExpression;

    /** Configuration for supported modes */
    mode: ModelledPropertyBuilderMode;

    /** Custom label for control */
    customLabel?: string;

    /** Custom tooltip next to the label for the control */
    customLabelTooltip?: ITooltipCalloutContent;

    /** Clears all value ranges and sets properties to 'None' */
    isClearEnabled?: boolean;

    /** Visual indication that this field is required.  Defaults to false */
    required?: boolean;

    /** Show 'None' option in dropdown */
    enableNoneDropdownOption?: boolean;

    /** Test ID for property select dropdown */
    dropdownTestId?: string;

    /** Custom text for intellisense placeholder */
    intellisensePlaceholder?: string;

    /** 
		Allows consumer to only allow specific property value types.
		Defaults to all value types.
	*/
    allowedPropertyValueTypes?: Array<PropertyValueType>;

    /**
     * Callback which fires when internal mode is changed
     * This will also call on intial mode selection to ensure
     * the consuming component is in sync with the internal mode
     */
    onInternalModeChanged?: (internalMode: ModelledPropertyBuilderMode) => void;

    /** 
        Reports back property or expression to consuming component when changed.
        
        If in PROPERTY_SELECTION mode, the property path & model are reported.
        allowing components such as the property widget builder to
        use information about the properties model.

        If in INTELLISENSE mode, the string expression is reported.
		
	*/
    onChange: (newPropertyExpression: PropertyExpression) => void;

    /**
     * Exlcude dtid from property picker dropdown
     */
    excludeDtid?: boolean;
}

export interface IModelledProperty {
    entity: any;
    fullPath: string;
    key: string;
    localPath: string;
    name: string;
    propertyType: PropertyValueType;
    schema: any;
}

export interface IFlattenedModelledPropertiesFormat {
    [tagName: string]: Array<IModelledProperty>;
}

export interface IModelledProperties {
    nestedFormat: Record<string, any>;
    flattenedFormat: IFlattenedModelledPropertiesFormat;
    intellisenseFormat: Record<string, any>;
}

export interface ITagModelMap {
    [PRIMARY_TWIN_NAME]: string[];
    aliasTags?: Record<string, string[]>;
}

export type PropertyExpression = {
    expression: string;
    property?: IModelledProperty;
};

export const defaultAllowedPropertyValueTypes: PropertyValueType[] = [
    'boolean',
    'date',
    'dateTime',
    'double',
    'duration',
    'float',
    'integer',
    'long',
    'string',
    'time',
    'enum'
];

export const numericPropertyValueTypes: PropertyValueType[] = [
    'double',
    'float',
    'integer',
    'long'
];

export const isResolvedTwinIdMode = (
    twinIdParams: BehaviorTwinIdParams | ResolvedTwinIdParams
): twinIdParams is ResolvedTwinIdParams => {
    return (twinIdParams as ResolvedTwinIdParams).primaryTwinIds !== undefined;
};
