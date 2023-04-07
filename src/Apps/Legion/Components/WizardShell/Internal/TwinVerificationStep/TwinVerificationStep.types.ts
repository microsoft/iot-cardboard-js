import { IButtonStyles, IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { IExtendedTheme } from '../../../../../../Theming/Theme.types';
import { IModel, ITwin } from '../../../../Models/Interfaces';

export interface ITwinVerificationStepProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        ITwinVerificationStepStyleProps,
        ITwinVerificationStepStyles
    >;
}

export interface ITwinVerificationStepStyleProps {
    theme: IExtendedTheme;
}
export interface ITwinVerificationStepStyles {
    root: IStyle;
    headerContainer: IStyle;
    buttonContainer: IStyle;
    content: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: ITwinVerificationStepSubComponentStyles;
}

export interface ITwinVerificationStepSubComponentStyles {
    button?: Partial<IButtonStyles>;
}

export interface IModelExtended extends IModel {
    color: string;
    selectedPropertyIds: Array<string>;
}

export interface ITwinExtended extends ITwin {
    model: IModelExtended;
    isSelected: boolean;
}
