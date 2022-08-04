import {
    ICalloutContentStyles,
    IStackStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { CardboardIconNames } from '../../Models/Constants';
import { IHeaderControlButtonStyles } from '../HeaderControlButton/HeaderControlButton.types';
import { IHeaderControlGroupStyles } from '../HeaderControlGroup/HeaderControlGroup.types';

export interface IHeaderControlButtonWithCalloutProps {
    buttonProps: {
        iconName: CardboardIconNames;
        testId: string;
        title: string;
    };
    calloutProps: {
        title: string;
        iconName: CardboardIconNames;
    };
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IHeaderControlButtonWithCalloutStyleProps,
        IHeaderControlButtonWithCalloutStyles
    >;
}

export interface IHeaderControlButtonWithCalloutStyleProps {
    theme: ITheme;
}
export interface IHeaderControlButtonWithCalloutStyles {
    root: IStyle;
    // calloutContent: IStyle;
    // header: IStyle;
    title: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IHeaderControlButtonWithCalloutSubComponentStyles;
}

export interface IHeaderControlButtonWithCalloutSubComponentStyles {
    callout?: Partial<ICalloutContentStyles>;
    calloutCloseIcon?: React.CSSProperties;
    headerStack?: Partial<IStackStyles>;
    headerControlGroup?: IHeaderControlGroupStyles;
    headerControlButton?: IHeaderControlButtonStyles;
}
