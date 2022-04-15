import { IStyle, mergeStyleSets } from '@fluentui/react';

const classPrefix = 'behaviors-form-pivot-header';
const classNames = {
    root: `${classPrefix}-root`,
    alert: `${classPrefix}-alert`
};
export const customPivotItemStyles = mergeStyleSets({
    root: [
        classNames.root,
        {
            alignItems: 'center',
            display: 'flex',
            flex: '0 1 100%'
        } as IStyle
    ],
    alert: [
        classNames.alert,
        {
            backgroundColor: 'var(--cb-color-text-error)',
            borderRadius: 6,
            height: 6,
            marginLeft: 4,
            marginTop: 4,
            width: 7
        } as IStyle
    ]
});
