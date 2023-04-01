import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { IExtendedTheme } from '../../../../../../Theming/Theme.types';

export interface IRelationshipBuilderStepProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IRelationshipBuilderStepStyleProps,
        IRelationshipBuilderStepStyles
    >;
}

export interface IRelationshipBuilderStepStyleProps {
    theme: IExtendedTheme;
}
export interface IRelationshipBuilderStepStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IRelationshipBuilderStepSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRelationshipBuilderStepSubComponentStyles {}