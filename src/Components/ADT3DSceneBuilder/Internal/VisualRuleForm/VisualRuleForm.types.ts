import {
    IButtonStyles,
    IDropdownStyles,
    ILabelStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITextFieldStyles,
    Theme
} from '@fluentui/react';
import { IExpressionRangeVisual } from '../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { ITooltipCalloutStyles } from '../../../TooltipCallout/TooltipCallout.types';
import { IConditionsListStyles } from './Internal/ConditionsList.types';

export interface IVisualRuleFormProps {
    handleExpressionTextFieldEnabled: (isEnabled: boolean) => void;
    isExpressionTextFieldEnabled: boolean;
    onCancelClick: (isDirty: boolean) => void;
    onSaveClick: (visualRule: IExpressionRangeVisual) => void;
    rootHeight: number;
    visualRuleId: string | null;
    styles?: IStyleFunctionOrObject<
        IVisualRuleFormStylesProps,
        IVisualRuleFormStyles
    >;
}

export interface IVisualRuleFormStyles {
    descriptionContainer: IStyle;
    subComponentStyles?: IVisualRuleFormSubComponentStyles;
}

export interface IVisualRuleFormStylesProps {
    theme: Theme;
}

export interface IVisualRuleFormSubComponentStyles {
    textField?: Partial<ITextFieldStyles>;
    dropdown?: Partial<IDropdownStyles>;
    label?: Partial<ILabelStyles>;
    tooltipCallout?: Partial<ITooltipCalloutStyles>;
    conditionsList?: Partial<IConditionsListStyles>;
    saveButton?: Partial<IButtonStyles>;
    cancelButton?: Partial<IButtonStyles>;
}
