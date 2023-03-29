import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { IExtendedTheme } from '../../../../../../Theming/Theme.types';

export interface IDataSourceStepProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IDataSourceStepStyleProps,
        IDataSourceStepStyles
    >;
}

export interface IDataSourceStepStyleProps {
    theme: IExtendedTheme;
}
export interface IDataSourceStepStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IDataSourceStepSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDataSourceStepSubComponentStyles {}
