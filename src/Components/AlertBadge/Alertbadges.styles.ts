import { IStyle } from '@fluentui/react';
import { IAlertBadgeStyleProps, IAlertBadgeStyles } from './AlertBadge.types';

export const alertBadgeClassPrefix = 'cb-alert-badge';
const classNames = {
    groupContainer: `${alertBadgeClassPrefix}-group-container`,
    singleContainer: `${alertBadgeClassPrefix}-single-container`,
    badge: `${alertBadgeClassPrefix}-badge`,
    internalBadge: `${alertBadgeClassPrefix}-internal-badge`,
    countBadge: `${alertBadgeClassPrefix}-count-badge`
};

export const getStyles = (props: IAlertBadgeStyleProps): IAlertBadgeStyles => {
    return {
        badge: [
            classNames.badge,
            {
                color: props.backgroundColor.defaultBadgeTextColor,
                width: '22px',
                height: '22px',
                borderRadius: '16px',
                textAlign: 'center',
                pointerEvents: 'none',
                lineHeight: '22px'
            } as IStyle
        ],
        internalBadge: [
            classNames.internalBadge,
            {
                color: props.backgroundColor.defaultBadgeTextColor,
                display: 'inline-block',
                width: '22px',
                height: '22px',
                borderRadius: '16px',
                textAlign: 'center',
                pointerEvents: 'none',
                lineHeight: '22px',
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
                color: props.backgroundColor.aggregateBadgeTextColor,
                background: props.backgroundColor.aggregateBadgeColor,
                width: '22px',
                height: '22px',
                borderRadius: '16px',
                textAlign: 'center',
                pointerEvents: 'none',
                lineHeight: '22px'
            } as IStyle
        ],
        groupContainer: [
            classNames.groupContainer,
            {
                // the 99 here is parsed in sceneview as opacity
                background: `${props.backgroundColor.badgeColor}99`,
                maxWidth: '50px',
                padding: '2px',
                borderRadius: '10px',
                textAlign: 'center',
                lineHeight: '22px'
            } as IStyle
        ],
        singleContainer: [
            classNames.singleContainer,
            {
                // the 99 here is parsed in sceneview as opacity
                background: `${props.backgroundColor.badgeColor}99`,
                paddingTop: '2px',
                paddingLeft: '2px',
                borderRadius: '18px',
                textAlign: 'center',
                lineHeight: '22px',
                width: '26px',
                height: '26px'
            } as IStyle
        ]
    };
};
