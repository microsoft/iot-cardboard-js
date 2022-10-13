import {
    IButtonStyles,
    IStyle,
    IStyleFunctionOrObject,
    Theme
} from '@fluentui/react';
import {
    IExpressionRangeType,
    IValueRange
} from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

export enum ConditionType {
    Badge,
    MeshColoring
}

export interface Conditions {
    id: string;
    primaryText: string;
    secondaryText: string;
    type: ConditionType;
    iconName?: string;
    color?: string;
}

export interface IConditionsListProps {
    valueRanges: IValueRange[];
    onDeleteCondition: (conditionId: string) => void;
    expressionType: IExpressionRangeType;
    styles?: IStyleFunctionOrObject<
        IConditionsListStylesProps,
        IConditionsListStyles
    >;
}

export interface IConditionsListStyles {
    container: IStyle;
    subComponentStyles?: IConditionsListSubComponentStyles;
}

export interface IConditionsListStylesProps {
    theme: Theme;
}

export interface IConditionsListSubComponentStyles {
    addButton?: Partial<IButtonStyles>;
}
