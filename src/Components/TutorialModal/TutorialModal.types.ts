import {
    IButtonStyles,
    INavStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITextStyles,
    ITheme
} from '@fluentui/react';
import { Locale, Theme } from '../../Models/Constants';

export interface ITutorialModalProps {
    defaultPageKey?: TutorialModalPage;
    isOpen: boolean;

    locale?: Locale;
    localeStrings?: Record<string, any>;
    onDismiss: () => void;
    theme?: Theme;

    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        ITutorialModalStyleProps,
        ITutorialModalStyles
    >;
}

export interface ITutorialModalStyleProps {
    theme: ITheme;
}
export interface ITutorialModalStyles {
    root: IStyle;
    header: IStyle;
    headerTextContainer: IStyle;
    headerText: IStyle;
    body: IStyle;
    contentPane: IStyle;
    illustrationPageContainer: IStyle;
    footer: IStyle;
    navContainer: IStyle;
    slideshowContainer: IStyle;
    slideChangeBtnContainerLeft: IStyle;
    slideChangeBtnContainerRight: IStyle;
    slideStatusIndicatorContainer: IStyle;
    previewBadge: IStyle;
    iconLabelContainer: IStyle;
    growContent: IStyle;
    /**
     * SubComponent styles.
     */
    subComponentStyles?: ITutorialModalSubComponentStyles;
}

export interface ITutorialModalSubComponentStyles {
    closeButton: IButtonStyles;
    chevronButton: IButtonStyles;
    slideIndicatorButton: IButtonStyles;
    linkSeparator: ITextStyles;
    nav: Partial<INavStyles>;
}

export enum TutorialModalActionType {
    SET_PAGE = 'SET_PAGE',
    SET_SLIDE = 'SET_SLIDE'
}

export enum TutorialModalPage {
    CONCEPTS = 'CONCEPTS',
    INTRODUCTION = 'INTRODUCTION',
    ELEMENTS = 'ELEMENTS',
    BEHAVIORS = 'BEHAVIORS',
    TWINS = 'TWINS',
    WIDGETS = 'WIDGETS',
    SCENELAYERS = 'SCENELAYERS'
}

export type TutorialModalAction =
    | {
          type: TutorialModalActionType.SET_PAGE;
          pageKey: TutorialModalPage;
      }
    | {
          type: TutorialModalActionType.SET_SLIDE;
          slide: number;
      };

export interface ITutorialModalState {
    pageKey: TutorialModalPage;
    slideNumber: number;
}
