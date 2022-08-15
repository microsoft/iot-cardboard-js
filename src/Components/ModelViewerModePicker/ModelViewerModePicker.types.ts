import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import {
    ViewerObjectStyle,
    IADTObjectColor,
    IADTBackgroundColor
} from '../../Models/Constants';
import { IObjectStyleOption } from '../../Models/Context/SceneThemeContext/SceneThemeContext.types';
import { IHeaderControlButtonWithCalloutStyles } from '../HeaderControlButtonWithCallout/HeaderControlButtonWithCallout.types';

export interface IModelViewerModePickerProps {
    selectedObjectColor: string;
    selectedObjectStyle: ViewerObjectStyle;
    selectedSceneBackground: string;
    objectColorOptions: IADTObjectColor[];
    backgroundColorOptions: IADTBackgroundColor[];
    objectStyleOptions: IObjectStyleOption[];
    onChangeObjectColor: (value: string) => void;
    onChangeObjectStyle: (value: ViewerObjectStyle) => void;
    onChangeSceneBackground: (value: string) => void;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IModelViewerModePickerStyleProps,
        IModelViewerModePickerStyles
    >;
}

export interface IModelViewerModePickerStyleProps {
    theme: ITheme;
}
export interface IModelViewerModePickerStyles {
    colorPicker: IStyle;
    subHeader: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IModelViewerModePickerSubComponentStyles;
}

export interface IModelViewerModePickerSubComponentStyles {
    headerControlWithCallout?: IHeaderControlButtonWithCalloutStyles;
}
