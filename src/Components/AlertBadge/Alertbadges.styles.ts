import {
    IStyle,
    memoizeFunction,
    mergeStyleSets,
    Theme
} from '@fluentui/react';
import { IADTBackgroundColor } from '../../Models/Constants';

export const alertBadgeClassPrefix = 'cb-alert-badge';
const classNames = {
    groupContainer: `${alertBadgeClassPrefix}-group-container`,
    singleContainer: `${alertBadgeClassPrefix}-single-container`,
    badge: `${alertBadgeClassPrefix}-badge`,
    internalBadge: `${alertBadgeClassPrefix}-internal-badge`,
    countBadge: `${alertBadgeClassPrefix}-count-badge`
};

export const getStyles = memoizeFunction(
    (theme: Theme, backgroundColor: IADTBackgroundColor) => {
        return mergeStyleSets({
            badge: [
                classNames.badge,
                {
                    color: backgroundColor.defaultBadgeTextColor,
                    width: '32px',
                    height: '32px',
                    borderRadius: '16px',
                    textAlign: 'center',
                    lineHeight: '32px'
                } as IStyle
            ],
            internalBadge: [
                classNames.internalBadge,
                {
                    color: backgroundColor.defaultBadgeTextColor,
                    display: 'inline-block',
                    width: '32px',
                    height: '32px',
                    borderRadius: '16px',
                    textAlign: 'center',
                    lineHeight: '32px',
                    selectors: {
                        ':nth-child(2),:nth-child(4)': {
                            marginLeft: '2px'
                        },
                        ':nth-child(3),:nth-child(4)': {
                            marginTop: '2px'
                        }
                    }
                } as IStyle
            ],
            countBadge: [
                classNames.countBadge,
                {
                    color: backgroundColor.aggregateBadgeTextColor,
                    background: backgroundColor.aggregateBadgeColor,
                    width: '32px',
                    height: '32px',
                    borderRadius: '16px',
                    textAlign: 'center',
                    lineHeight: '32px'
                } as IStyle
            ],
            groupContainer: [
                classNames.groupContainer,
                {
                    background: `${backgroundColor.badgeColor}99`,
                    maxWidth: '70px',
                    padding: '2px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    lineHeight: '32px'
                } as IStyle
            ],
            singleContainer: [
                classNames.singleContainer,
                {
                    background: `${backgroundColor.badgeColor}99`,
                    paddingTop: '2px',
                    paddingLeft: '2px',
                    borderRadius: '18px',
                    textAlign: 'center',
                    lineHeight: '34px',
                    width: '36px',
                    height: '36px'
                } as IStyle
            ]
        });
    }
);
