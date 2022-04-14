import {
    FontSizes,
    FontWeights,
    IStyle,
    memoizeFunction,
    mergeStyleSets
} from '@fluentui/react';

export const focusCalloutClassPrefix = 'cb-focus-callout';

const classNames = {
    calloutContent: `${focusCalloutClassPrefix}-callout-content`,
    header: `${focusCalloutClassPrefix}-callout-header`,
    title: `${focusCalloutClassPrefix}-callout-title`,
    titleIcon: `${focusCalloutClassPrefix}-title-icon`
};

export const getStyles = memoizeFunction(() => {
    return mergeStyleSets({
        calloutContent: [
            classNames.calloutContent,
            {
                position: 'relative',
                overflow: 'hidden'
            } as IStyle
        ],
        header: [
            classNames.header,
            {
                display: 'flex',
                lineHeight: '32px',
                verticalAlign: 'middle',
                padding: '12px 12px 0px 20px',
                height: 48
            } as IStyle
        ],
        title: [
            classNames.title,
            {
                fontSize: FontSizes.size16,
                marginLeft: 4,
                fontWeight: FontWeights.semibold,
                flex: '1'
            } as IStyle
        ],
        titleIcon: [
            classNames.titleIcon,
            {
                width: 32,
                height: 32,
                fontSize: FontSizes.size16,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            } as IStyle
        ]
    });
});
