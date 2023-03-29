import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { IExtendedTheme } from '../../Theming/Theme.types';

export interface ISampleGraphProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<ISampleGraphStyleProps, ISampleGraphStyles>;
}

export interface ISampleGraphStyleProps {
    theme: IExtendedTheme;
}
export interface ISampleGraphStyles {
    root: IStyle;
    graphContainer: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: ISampleGraphSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ISampleGraphSubComponentStyles {}
