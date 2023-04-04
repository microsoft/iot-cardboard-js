import { IButtonStyles, IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { IExtendedTheme } from '../../../../../../Theming/Theme.types';

export interface ITwinVerificationStepProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        ITwinVerificationStepStyleProps,
        ITwinVerificationStepStyles
    >;
}

export interface ITwinVerificationStepStyleProps {
    theme: IExtendedTheme;
}
export interface ITwinVerificationStepStyles {
    root: IStyle;
    headerContainer: IStyle;
    content: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: ITwinVerificationStepSubComponentStyles;
}

export interface ITwinVerificationStepSubComponentStyles {
    button: Partial<IButtonStyles>;
}

export interface IViewModelFromCooked {
    id: string;
    name: string;
    color: string;
    propertyIds: Array<string>;
    selectedPropertyIds: Array<string>;
}

export interface IViewTwinFromCooked {
    id: string;
    model: IViewModelFromCooked;
    isSelected: boolean;
}
