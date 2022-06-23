import {
    IStyle,
    memoizeFunction,
    mergeStyleSets,
    Theme
} from '@fluentui/react';

export const alertBadgeClassPrefix = 'cb-alert-badge';
const classNames = {
    badge: `${alertBadgeClassPrefix}-badge`
};

export const getStyles = memoizeFunction((theme: Theme) => {
    return mergeStyleSets({
        badge: [
            classNames.badge,
            {
                color: 'white',
                width: '32px',
                height: '32px',
                borderRadius: '16px',
                textAlign: 'center',
                lineHeight: '32px',
                boxShadow: '0px 0px 0px 3px rgba(0,0,0,0.3)'
            } as IStyle
        ]
    });
});
