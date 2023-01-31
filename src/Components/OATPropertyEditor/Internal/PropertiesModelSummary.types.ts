import {
    IStyleFunctionOrObject,
    IStackStyles,
    IStyle,
    ISeparatorStyles,
    ITextFieldStyles,
    ISpinButtonStyles
} from '@fluentui/react';
import { DtdlInterface, DtdlInterfaceContent } from '../../..';
import { DtdlRelationship } from '../../../Models/Constants';
import { IExtendedTheme } from '../../../Theming/Theme.types';

export interface IPartialModelId {
    namespace?: string;
    modelName?: string;
    path?: string;
    version?: string;
}

export type IPropertiesModelSummaryProps = {
    isSupportedModelType: boolean;
    selectedItem: DtdlInterface | DtdlInterfaceContent | DtdlRelationship;

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
    sectionTitle: IStyle;
    sectionSubtitle: IStyle;
    /**
     * SubComponent styles.
     */
    subComponentStyles?: IPropertiesModelSummarySubComponentStyles;
}

export interface IPropertiesModelSummarySubComponentStyles {
    rootStack?: IStackStyles;
    separator?: Partial<ISeparatorStyles>;
    stringField?: Partial<ITextFieldStyles>;
    numericField?: Partial<ISpinButtonStyles>;
}
