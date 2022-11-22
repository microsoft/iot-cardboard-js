import { ICalloutContentStyles, IStyleFunctionOrObject } from '@fluentui/react';
import { VisualColorings } from '../../../Models/Constants/VisualRuleTypes';
import { IExtendedTheme } from '../../../Theming/Theme.types';

export interface IElementColoringProps {
    colorings: VisualColorings[];
    isModal: boolean;
    isCalloutOpen: boolean;
    rowId: string;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IElementColoringStyleProps,
        IElementColoringStyles
    >;
}

export interface IElementColoringStyleProps {
    theme: IExtendedTheme;
}
export interface IElementColoringStyles {
    /**
     * SubComponent styles.
     */
    subComponentStyles?: IElementColoringSubComponentStyles;
}

export interface IElementColoringSubComponentStyles {
    callout?: Partial<ICalloutContentStyles>;
}
