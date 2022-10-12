import {
    IButtonStyles,
    IDropdownStyles,
    ILabelStyles,
    IStyleFunctionOrObject,
    ITextFieldStyles,
    Theme
} from '@fluentui/react';
import { ITooltipCalloutStyles } from '../../../TooltipCallout/TooltipCallout.types';
import { IConditionsListStyles } from './Internal/ConditionsList.types';

export interface IVisualRuleFormProps {
    isPropertyTypeDropdownEnabled: boolean;
    rootHeight: number;
    setPropertyTypeDropdownEnabled: (isEnabled: boolean) => void;
    styles?: IStyleFunctionOrObject<
        IVisualRuleFormStylesProps,
        IVisualRuleFormStyles
    >;
}

export interface IVisualRuleFormStyles {
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
