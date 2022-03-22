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
            borderRadius: 4,
            height: 4,
            marginLeft: 4,
            marginTop: 2,
            width: 4
        } as IStyle
    ]
});
