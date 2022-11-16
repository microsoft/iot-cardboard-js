import { FontSizes, IStyle } from '@fluentui/react';
import { IBadgeBlockStyleProps, IBadgeBlockStyles } from './BadgeBlock.types';

export const classPrefix = 'cb-badgeblock';
const classNames = {
    iconCircle: `${classPrefix}-iconCircle`,
    infoContainer: `${classPrefix}-infoContainer`,
    infoTextContainer: `${classPrefix}-infoTextContainer`
};
export const getBadgeBlockStyles = (
    props: IBadgeBlockStyleProps
): IBadgeBlockStyles => {
    return {
        iconCircle: [
            classNames.iconCircle,
            {
                width: 20,
                height: 20,
                borderRadius: 30,
                backgroundColor: props.badgeColor,
                flexShrink: 0,
                margin: `0 8px 0 10px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            } as IStyle
        ],
        infoContainer: [
            classNames.infoContainer,
            {
                display: 'flex',
                flexDirection: 'row',
                marginBottom: 8
            } as IStyle
        ],
        infoTextContainer: [
            classNames.infoTextContainer,
            {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: FontSizes.size12
            } as IStyle
        ],
        subComponentStyles: {}
    };
};
