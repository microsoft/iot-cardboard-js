import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { MockAdapter } from '../../../../Adapters';
import IngressAdapter from '../../../../Adapters/IngressAdapter';
import { ICardBaseProps } from '../../../../Models/Constants';
import { IExtendedTheme } from '../../../../Theming/Theme.types';

export interface IIngressAppProps extends ICardBaseProps {
    adapter: IngressAdapter | MockAdapter;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<IIngressAppStyleProps, IIngressAppStyles>;
}

export interface IIngressAppStyleProps {
    theme: IExtendedTheme;
}
export interface IIngressAppStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IIngressAppSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IIngressAppSubComponentStyles {}
