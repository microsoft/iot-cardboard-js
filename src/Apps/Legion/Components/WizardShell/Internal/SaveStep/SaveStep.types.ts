import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { IExtendedTheme } from '../../../../../../Theming/Theme.types';

export interface ISaveStepProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<ISaveStepStyleProps, ISaveStepStyles>;
}

export interface ISaveStepStyleProps {
    theme: IExtendedTheme;
}
export interface ISaveStepStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: ISaveStepSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISaveStepSubComponentStyles {}
