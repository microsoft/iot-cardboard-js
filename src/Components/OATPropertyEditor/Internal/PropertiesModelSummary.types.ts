import {
    IStyleFunctionOrObject,
    IStackStyles,
    IButtonStyles,
    IStyle,
    ISeparatorStyles,
    ITextFieldStyles,
    ISpinButtonStyles
} from '@fluentui/react';
import { DtdlInterface, DtdlInterfaceContent } from '../../..';
import { IAction } from '../../../Models/Constants/Interfaces';
import { IExtendedTheme } from '../../../Theming/Theme.types';

export interface IPartialModelId {
    namespace?: string;
    modelName?: string;
    path?: string;
    version?: string;
}

export type IPropertiesModelSummaryProps = {
    dispatch: React.Dispatch<React.SetStateAction<IAction>>;
    isSupportedModelType: boolean;
    selectedItem: DtdlInterface | DtdlInterfaceContent;

    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IPropertiesModelSummaryStyleProps,
        IPropertiesModelSummaryStyles
    >;
};

export interface IPropertiesModelSummaryStyleProps {
    theme: IExtendedTheme;
}
export interface IPropertiesModelSummaryStyles {
    row: IStyle;
    rowLabel: IStyle;
    sectionHeaderRoot: IStyle;
    sectionHeaderContainer: IStyle;
    sectionTitle: IStyle;
    sectionSubtitle: IStyle;
    /**
     * SubComponent styles.
     */
    subComponentStyles?: IPropertiesModelSummarySubComponentStyles;
}

export interface IPropertiesModelSummarySubComponentStyles {
    modalIconButton?: Partial<IButtonStyles>;
    rootStack?: IStackStyles;
    separator?: Partial<ISeparatorStyles>;
    stringField?: Partial<ITextFieldStyles>;
    numericField?: Partial<ISpinButtonStyles>;
}
