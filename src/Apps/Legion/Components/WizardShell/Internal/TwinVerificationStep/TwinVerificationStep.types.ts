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
