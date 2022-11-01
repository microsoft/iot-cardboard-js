import {
    IButtonStyles,
    IIconStyles,
    IStyle,
    IStyleFunctionOrObject,
    Theme
} from '@fluentui/react';
import {
    IDTDLPropertyType,
    IExpressionRangeType,
    IValueRange
} from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

export enum ConditionType {
    Badge,
    MeshColoring
}

export interface Condition {
    id: string;
    primaryText: string;
    secondaryText: string;
    type: ConditionType;
    iconName?: string;
    color?: string;
    isUnlabeled?: boolean;
}

export enum CalloutInfoType {
    inactive,
    edit,
    create
}
export interface CalloutInfo {
    calloutType: CalloutInfoType;
    selectedCondition: IValueRange;
    selectedTarget: string;
}

export interface IConditionsListProps {
    expressionType: IExpressionRangeType;
    onDeleteCondition: (conditionId: string) => void;
    onSaveCondition: (condition: IValueRange) => void;
    valueRanges: IValueRange[];
    valueRangeType: IDTDLPropertyType;
    styles?: IStyleFunctionOrObject<
        IConditionsListStylesProps,
        IConditionsListStyles
    >;
}

export interface IConditionsListStyles {
    root: IStyle;
    subComponentStyles?: IConditionsListSubComponentStyles;
}

export interface IConditionsListStylesProps {
    theme: Theme;
}

export interface IConditionsListSubComponentStyles {
    addButton?: Partial<IButtonStyles>;
    itemButton?: IStyleFunctionOrObject<
        { isUnlabeled: boolean },
        IButtonStyles
    >;
    meshIcon?: IStyleFunctionOrObject<{ color: string }, IIconStyles>;
    badgeIcon?: IStyleFunctionOrObject<{ color: string }, IIconStyles>;
}
