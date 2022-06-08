import {
    IBehavior,
    IExpressionRangeType,
    IExpressionRangeVisual,
    IPopoverVisual,
    IVisual,
    IWidget
} from '../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

export interface IBehaviorFormContextProviderProps {
    behaviorToEdit: IBehavior;
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
    isDirty: boolean;
}

/**
 * The actions to update the state
 */
export enum BehaviorFormContextActionType {
    /** reverts all changes to the behavior back to it's initial state */
    FORM_BEHAVIOR_RESET = 'FORM_BEHAVIOR_RESET',

    FORM_BEHAVIOR_ID_SET = 'FORM_BEHAVIOR_ID_SET',
    FORM_BEHAVIOR_DISPLAY_NAME_SET = 'FORM_BEHAVIOR_DISPLAY_NAME_SET',

    FORM_BEHAVIOR_DATA_SOURCE_ADD_OR_UPDATE = 'FORM_BEHAVIOR_DATA_SOURCE_ADD_OR_UPDATE',
    FORM_BEHAVIOR_DATA_SOURCE_REMOVE = 'FORM_BEHAVIOR_DATA_SOURCE_REMOVE',

    FORM_BEHAVIOR_ALIAS_ADD_OR_UPDATE = 'FORM_BEHAVIOR_ALIAS_ADD_OR_UPDATE',
    FORM_BEHAVIOR_ALIAS_REMOVE = 'FORM_BEHAVIOR_ALIAS_REMOVE',

    FORM_BEHAVIOR_POPOVER_VISUAL_ADD_OR_UPDATE = 'FORM_BEHAVIOR_POPOVER_VISUAL_ADD_OR_UPDATE',
    FORM_BEHAVIOR_POPOVER_VISUAL_REMOVE = 'FORM_BEHAVIOR_POPOVER_VISUAL_REMOVE',

    FORM_BEHAVIOR_WIDGET_ADD_OR_UPDATE = 'FORM_BEHAVIOR_WIDGET_ADD_OR_UPDATE',
    FORM_BEHAVIOR_WIDGET_REMOVE = 'FORM_BEHAVIOR_WIDGET_REMOVE',

    FORM_BEHAVIOR_ALERT_VISUAL_ADD_OR_UPDATE = 'FORM_BEHAVIOR_ALERT_VISUAL_ADD_OR_UPDATE',
    FORM_BEHAVIOR_ALERT_VISUAL_REMOVE = 'FORM_BEHAVIOR_ALERT_VISUAL_REMOVE',

    FORM_BEHAVIOR_STATUS_VISUAL_ADD_OR_UPDATE = 'FORM_BEHAVIOR_STATUS_VISUAL_ADD_OR_UPDATE',
    FORM_BEHAVIOR_STATUS_VISUAL_REMOVE = 'FORM_BEHAVIOR_STATUS_VISUAL_REMOVE'
}

/** The actions to update the state */
export type BehaviorFormContextAction =
    // OPERATIONS
    | {
          type: BehaviorFormContextActionType.FORM_BEHAVIOR_RESET;
      }
    // BEHAVIOR PROPERTIES
    | {
          type: BehaviorFormContextActionType.FORM_BEHAVIOR_ID_SET;
          payload: { id: string };
      }
    | {
          type: BehaviorFormContextActionType.FORM_BEHAVIOR_DISPLAY_NAME_SET;
          payload: { name: string };
      }
    // DATA SOURCES
    | {
          type: BehaviorFormContextActionType.FORM_BEHAVIOR_DATA_SOURCE_ADD_OR_UPDATE;
          payload: { source: string };
      }
    | {
          type: BehaviorFormContextActionType.FORM_BEHAVIOR_DATA_SOURCE_REMOVE;
          payload: { source: string };
      }
    // ALIASES
    | {
          type: BehaviorFormContextActionType.FORM_BEHAVIOR_ALIAS_ADD_OR_UPDATE;
          payload: { alias: string };
      }
    | {
          type: BehaviorFormContextActionType.FORM_BEHAVIOR_ALIAS_REMOVE;
          payload: { alias: string };
      }
    // POPOVER
    | {
          type: BehaviorFormContextActionType.FORM_BEHAVIOR_POPOVER_VISUAL_ADD_OR_UPDATE;
          payload: { visual: IPopoverVisual };
      }
    | {
          type: BehaviorFormContextActionType.FORM_BEHAVIOR_POPOVER_VISUAL_REMOVE;
      }
    // ALERTS
    | {
          type: BehaviorFormContextActionType.FORM_BEHAVIOR_ALERT_VISUAL_ADD_OR_UPDATE;
          payload: { visual: IExpressionRangeVisual };
      }
    | {
          type: BehaviorFormContextActionType.FORM_BEHAVIOR_ALERT_VISUAL_REMOVE;
      }
    // STATUS
    | {
          type: BehaviorFormContextActionType.FORM_BEHAVIOR_STATUS_VISUAL_ADD_OR_UPDATE;
          payload: { visual: IExpressionRangeVisual };
      }
    | {
          type: BehaviorFormContextActionType.FORM_BEHAVIOR_STATUS_VISUAL_REMOVE;
      }
    // WIDGETS
    | {
          type: BehaviorFormContextActionType.FORM_BEHAVIOR_WIDGET_ADD_OR_UPDATE;
          payload: { widget: IWidget };
      }
    | {
          type: BehaviorFormContextActionType.FORM_BEHAVIOR_WIDGET_REMOVE;
          payload: { widgetId: string };
      };
