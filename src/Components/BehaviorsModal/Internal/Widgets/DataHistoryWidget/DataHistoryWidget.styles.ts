import { IStyle, mergeStyleSets } from '@fluentui/react';

export const classPrefix = 'cb-data-history-widget';
const classNames = {
    container: `${classPrefix}-container`,
    chart: `${classPrefix}-chart`
};

export const dataHistoryClassNames = mergeStyleSets({
    // TODO: fix styling with new format
    container: [
        classNames.container,
        {
            width: '100%',
            height: '100%',
            padding: 0,
            position: 'relative',
            overflow: 'hidden'
        } as IStyle
    ],
    chart: [
        classNames.chart,
        {
            backgroundColor: 'transparent'
        } as IStyle
    ]
});
