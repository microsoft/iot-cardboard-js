import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { SceneViewBadgeGroup } from '../../Models/Classes/SceneView.types';
import { IADTBackgroundColor } from '../../Models/Constants/Interfaces';

export interface IAlertBadgeProps {
    badgeGroup: SceneViewBadgeGroup;
    onBadgeGroupHover?: (
        alert: SceneViewBadgeGroup,
        left: number,
        top: number
    ) => void;
    backgroundColor: IADTBackgroundColor;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<undefined, IAlertBadgeStyles>;
}

export interface IAlertBadgeStyleProps {
    backgroundColor: IADTBackgroundColor;
}
export interface IAlertBadgeStyles {
    groupContainer: IStyle;
    singleContainer: IStyle;
    badge: IStyle;
    internalBadge: IStyle;
    countBadge: IStyle;
}
