import {
    IStyle,
    memoizeFunction,
    mergeStyleSets,
    Theme
} from '@fluentui/react';

export const focusCalloutClassPrefix = 'cb-focus-callout';

const classNames = {
    calloutContent: `${focusCalloutClassPrefix}-callout-content`,
    header: `${focusCalloutClassPrefix}-callout-header`,
    title: `${focusCalloutClassPrefix}-callout-title`
};

export const getStyles = memoizeFunction((_theme?: Theme) => {
    return mergeStyleSets({
        calloutContent: [
            classNames.calloutContent,
            {
                position: 'relative'
            } as IStyle
        ],
        header: [
            classNames.header,
            {
                display: 'flex',
                lineHeight: '32px',
                verticalAlign: 'middle',
                fontSize: '16',
                padding: '12px 12px 0px 20px'
            } as IStyle
        ],
        title: [
            classNames.title,
            {
                marginLeft: '12px',
                fontWeight: '500',
                flex: '1'
            } as IStyle
        ]
    });
});
