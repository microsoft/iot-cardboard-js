import {
    IBehavior,
    IElementTwinToObjectMappingDataSource,
    IExpressionRangeVisual,
    IWidget
} from '../../Types/Generated/3DScenesConfiguration-v1.0.0';

export interface IBehaviorFormContextProviderProps {
    behaviorToEdit: IBehavior;
    behaviorSelectedLayerIds: string[];
}

/**
 * A context used for capturing the current state of the app and restoring it to a new instance of the app
 */
export interface IBehaviorFormContext {
    behaviorFormState: IBehaviorFormContextState;
    behaviorFormDispatch: React.Dispatch<BehaviorFormContextAction>;
}

/**
 * The state of the context
 */
export interface IBehaviorFormContextState {
    behaviorToEdit: IBehavior | null;
    behaviorSelectedLayerIds: string[];
    isDirty: boolean;
}

/**
 * The actions to update the state
 */
export enum BehaviorFormContextActionType {
    /** add, update or remove a visual rule */
    FORM_BEHAVIOR_VISUAL_RULE_ADD_OR_UPDATE = 'FORM_BEHAVIOR_VISUAL_RULE_ADD_OR_UPDATE',
    FORM_BEHAVIOR_VISUAL_RULE_REMOVE = 'FORM_BEHAVIOR_VISUAL_RULE_REMOVE',

    /** add or update a twin alias */
    FORM_BEHAVIOR_ALIAS_ADD = 'FORM_BEHAVIOR_ALIAS_ADD',
    /** remove a twin alias */
    FORM_BEHAVIOR_ALIAS_REMOVE = 'FORM_BEHAVIOR_ALIAS_REMOVE',

    /** add or update a data source */
    FORM_BEHAVIOR_DATA_SOURCE_ADD_OR_UPDATE = 'FORM_BEHAVIOR_DATA_SOURCE_ADD_OR_UPDATE',
    /** remove a data source */
    FORM_BEHAVIOR_DATA_SOURCE_REMOVE = 'FORM_BEHAVIOR_DATA_SOURCE_REMOVE',

    /** set the behavior name */
    FORM_BEHAVIOR_DISPLAY_NAME_SET = 'FORM_BEHAVIOR_DISPLAY_NAME_SET',

    /** sets the selected layer ids that the behavior should be included in */
    FORM_BEHAVIOR_LAYERS_ADD = 'FORM_BEHAVIOR_LAYERS_ADD',
    FORM_BEHAVIOR_LAYERS_REMOVE = 'FORM_BEHAVIOR_LAYERS_REMOVE',

    /** reverts all changes to the behavior back to it's initial state */
    FORM_BEHAVIOR_RESET = 'FORM_BEHAVIOR_RESET',
    /** add or update a widget */
    FORM_BEHAVIOR_WIDGET_ADD_OR_UPDATE = 'FORM_BEHAVIOR_WIDGET_ADD_OR_UPDATE',
    /** remove a widget */
    FORM_BEHAVIOR_WIDGET_REMOVE = 'FORM_BEHAVIOR_WIDGET_REMOVE'
}

/** The actions to update the state */
export type BehaviorFormContextAction =
    // ALIASES
    | {
          type: BehaviorFormContextActionType.FORM_BEHAVIOR_ALIAS_ADD;
          payload: { alias: string };
      }
    | {
          type: BehaviorFormContextActionType.FORM_BEHAVIOR_ALIAS_REMOVE;
          payload: { alias: string };
      }
    // DATA SOURCES
    | {
          type: BehaviorFormContextActionType.FORM_BEHAVIOR_DATA_SOURCE_ADD_OR_UPDATE;
          payload: { source: IElementTwinToObjectMappingDataSource };
      }
    | {
          type: BehaviorFormContextActionType.FORM_BEHAVIOR_DATA_SOURCE_REMOVE;
      }
    // BEHAVIOR PROPERTIES
    | {
          type: BehaviorFormContextActionType.FORM_BEHAVIOR_DISPLAY_NAME_SET;
          payload: { name: string };
      }
    // BEHAVIOR LAYERS
    | {
          type: BehaviorFormContextActionType.FORM_BEHAVIOR_LAYERS_ADD;
          payload: {
              layerId: string;
          };
      }
    | {
          type: BehaviorFormContextActionType.FORM_BEHAVIOR_LAYERS_REMOVE;
          payload: {
              layerId: string;
          };
      }
    // BEHAVIOR OPERATIONS
    | {
          type: BehaviorFormContextActionType.FORM_BEHAVIOR_RESET;
          payload?: {
              behavior?: IBehavior;
              layerIds?: string[];
          };
      }
    // WIDGETS
    | {
          type: BehaviorFormContextActionType.FORM_BEHAVIOR_WIDGET_ADD_OR_UPDATE;
          payload: { widget: IWidget };
      }
    | {
          type: BehaviorFormContextActionType.FORM_BEHAVIOR_WIDGET_REMOVE;
          payload: { widgetId: string };
      }
    // VISUAL RULES
    | {
          type: BehaviorFormContextActionType.FORM_BEHAVIOR_VISUAL_RULE_ADD_OR_UPDATE;
          payload: { visualRule: IExpressionRangeVisual };
      }
    | {
          type: BehaviorFormContextActionType.FORM_BEHAVIOR_VISUAL_RULE_REMOVE;
          payload: { visualRuleId: string };
      };
