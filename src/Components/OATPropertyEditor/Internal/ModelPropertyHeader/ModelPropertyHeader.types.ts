import { IButtonStyles, IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { IExtendedTheme } from '../../../../Theming/Theme.types';

export interface IModelPropertyHeaderProps {
    entityId: string;
    entityType: string;
    entityName: string;
    onInfoButtonClick?: () => void;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IModelPropertyHeaderStyleProps,
        IModelPropertyHeaderStyles
    >;
}

export interface IModelPropertyHeaderStyleProps {
    theme: IExtendedTheme;
}
export interface IModelPropertyHeaderStyles {
    root: IStyle;
    sectionHeaderRoot: IStyle;
    sectionHeaderIcon: IStyle;
    sectionHeaderContainer: IStyle;
    sectionTitle: IStyle;
    sectionSubtitle: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IModelPropertyHeaderSubComponentStyles;
}

export interface IModelPropertyHeaderSubComponentStyles {
    modalIconButton?: Partial<IButtonStyles>;
}
