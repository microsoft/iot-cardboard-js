import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import { VisualBadges } from '../../../../Models/Constants/VisualRuleTypes';

export interface IBadgeBlockProps {
    badgeVisual: VisualBadges;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<IBadgeBlockStyleProps, IBadgeBlockStyles>;
}

export interface IBadgeBlockStyleProps {
    badgeColor: string;
    theme: ITheme;
}
export interface IBadgeBlockStyles {
    iconCircle: IStyle;
    infoContainer: IStyle;
    infoTextContainer: IStyle;
    /**
     * SubComponent styles.
     */
    subComponentStyles?: IBadgeBlockSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IBadgeBlockSubComponentStyles {}
