import {
    IButtonStyles,
    IDropdownStyles,
    ILabelStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITextFieldStyles,
    Theme
} from '@fluentui/react';
import { ITooltipCalloutStyles } from '../../../TooltipCallout/TooltipCallout.types';
import { IConditionsListStyles } from './Internal/ConditionsList.types';

export interface IVisualRuleFormProps {
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
