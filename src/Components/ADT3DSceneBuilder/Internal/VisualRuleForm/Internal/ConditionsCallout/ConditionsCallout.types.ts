import {
    IButtonStyles,
    ICalloutContentStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import {
    IDTDLPropertyType,
    IValueRange
} from '../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { CalloutInfoType } from '../ConditionsList.types';

export interface IConditionsCalloutProps {
    calloutType: CalloutInfoType;
    isOpen: boolean;
    onDismiss: () => void;
    onSave: (condition: IValueRange) => void;
    target: string;
    valueRange: IValueRange;
    valueRangeType: IDTDLPropertyType;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IConditionsCalloutStyleProps,
        IConditionsCalloutStyles
    >;
}

export interface IConditionsCalloutStyleProps {
    theme: ITheme;
}
export interface IConditionsCalloutStyles {
    root: IStyle;
    footer: IStyle;
    title: IStyle;
    /**
     * SubComponent styles.
     */
    subComponentStyles?: IConditionsCalloutSubComponentStyles;
}

export interface IConditionsCalloutSubComponentStyles {
    callout?: Partial<ICalloutContentStyles>;
    saveButton?: Partial<IButtonStyles>;
    cancelButton?: Partial<IButtonStyles>;
}

/** Condition summary types */
export interface IConditionSummaryProps {
    areValuesValid: boolean;
    conditionType: IDTDLPropertyType;
    currentValues: unknown[];
    onChangeValues: (
        valueType: IDTDLPropertyType,
        newValues: unknown[],
        index?: number
    ) => void;
}

export interface IValueRangeValidation {
    minValid: boolean;
    maxValid: boolean;
    rangeValid: boolean;
}

/** Action item types */
export type ActionItemKey = 'color' | 'iconName';

export interface IActionItemProps {
    color?: string;
    iconName?: string;
    setActionSelectedValue(key: ActionItemKey, value: string);
}

/** Reducer types */
export type ConditionValidityMapKeys = 'label' | 'ranges';

export type ConditionValidityMap = {
    [key in ConditionValidityMapKeys]: boolean;
};

export interface IConditionCalloutState {
    originalCondition: IValueRange;
    conditionToEdit: IValueRange;
    isDirty: boolean;
}

export type ConditionCalloutReducerType = (
    draft: IConditionCalloutState,
    action: ConditionCalloutAction
) => IConditionCalloutState;

export enum ConditionCalloutActionType {
    /** Condition actions */
    FORM_CONDITION_LABEL_SET = 'FORM_CONDITION_LABEL_SET',
    FORM_CONDITION_VALUES_SET = 'FORM_CONDITION_VALUES_SET',
    FORM_CONDITION_COLOR_SET = 'FORM_CONDITION_COLOR_SET',
    FORM_CONDITION_ICON_SET = 'FORM_CONDITION_ICON_SET',
    RESET_CONDITION = 'RESET_CONDITION',
    /** Numerical values handling */
    FORM_CONDITION_NUMERICAL_VALUES_SET = 'FORM_CONDITION_NUMERICAL_VALUES_SET',
    FORM_CONDITION_SNAP_VALUE_TO_INFINITY = 'FORM_CONDITION_SNAP_VALUE_TO_INFINITY',
    FORM_CONDITION_SET_ARE_RANGES_VALID = 'FORM_CONDITION_SET_ARE_RANGES_VALID'
}

export type ConditionCalloutAction =
    | {
          type: ConditionCalloutActionType.FORM_CONDITION_LABEL_SET;
          payload: { label: string };
      }
    | {
          type: ConditionCalloutActionType.FORM_CONDITION_VALUES_SET;
          payload: { values: unknown[] };
      }
    | {
          type: ConditionCalloutActionType.FORM_CONDITION_COLOR_SET;
          payload: { color: string };
      }
    | {
          type: ConditionCalloutActionType.FORM_CONDITION_ICON_SET;
          payload: { iconName: string };
      }
    | {
          type: ConditionCalloutActionType.RESET_CONDITION;
          payload: { valueRange: IValueRange };
      }
    | {
          type: ConditionCalloutActionType.FORM_CONDITION_NUMERICAL_VALUES_SET;
          payload: { values: unknown[] };
      }
    | {
          type: ConditionCalloutActionType.FORM_CONDITION_SNAP_VALUE_TO_INFINITY;
          payload: { values: unknown[] };
      }
    | {
          type: ConditionCalloutActionType.FORM_CONDITION_SET_ARE_RANGES_VALID;
          payload: { min: string; max: string };
      };
