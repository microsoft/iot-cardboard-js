import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { IExtendedTheme } from '../../../../Theming/Theme.types';

export interface IStoreListPageProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IStoreListPageStyleProps,
        IStoreListPageStyles
    >;
}

export interface IStoreListPageStyleProps {
    theme: IExtendedTheme;
}
export interface IStoreListPageStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IStoreListPageSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IStoreListPageSubComponentStyles {}
