import {
    IStackStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import {
    IFocusCalloutButtonStyleProps,
    IFocusCalloutButtonStyles
} from '../../../FocusCalloutButton/FocusCalloutButton.types';

export interface ISceneLayersProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<ISceneLayersStyleProps, ISceneLayersStyles>;
}

export interface ISceneLayersStyleProps {
    isFlyoutOpen: boolean;
    theme: ITheme;
}
export interface ISceneLayersStyles {
    /**
     * SubComponent styles.
     */
    subComponentStyles?: ISceneLayersSubComponentStyles;
}

export interface ISceneLayersSubComponentStyles {
    button: IStyleFunctionOrObject<
        IFocusCalloutButtonStyleProps,
        IFocusCalloutButtonStyles
    >;
}

export interface IPrimaryActionCalloutContentsProps {
    children?: React.ReactNode;
    primaryButtonText: string;
    onPrimaryButtonClick: () => any;
    disablePrimaryButton?: boolean;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IPrimaryActionCalloutContentsStyleProps,
        IPrimaryActionCalloutContentsStyles
    >;
}

export interface IPrimaryActionCalloutContentsStyleProps {
    theme: ITheme;
}
export interface IPrimaryActionCalloutContentsStyles {
    container: IStyle;
    footer: IStyle;
    body: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IPrimaryActionCalloutContentsSubComponentStyles;
}

export interface IPrimaryActionCalloutContentsSubComponentStyles {
    stack: IStackStyles;
}

export enum LayerDialogMode {
    Root = 'root',
    NewLayer = 'newLayer',
    EditLayer = 'editLayer'
}
