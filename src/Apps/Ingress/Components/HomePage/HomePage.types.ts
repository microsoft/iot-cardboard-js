import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { MockAdapter } from '../../../../Adapters';
import IngressAdapter from '../../../../Adapters/IngressAdapter';
import { IExtendedTheme } from '../../../../Theming/Theme.types';

export interface IHomePageProps {
    adapter: IngressAdapter | MockAdapter;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<IHomePageStyleProps, IHomePageStyles>;
}

export interface IHomePageStyleProps {
    theme: IExtendedTheme;
}
export interface IHomePageStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IHomePageSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IHomePageSubComponentStyles {}
