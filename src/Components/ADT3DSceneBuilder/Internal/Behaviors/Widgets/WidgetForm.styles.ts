import {
    memoizeFunction,
    mergeStyleSets,
    FontSizes,
    IStyle,
    Theme
} from '@fluentui/react';

const classPrefix = 'widget-form';
const classNames = {
    description: `${classPrefix}-description`,
    gaugeWidgetFormContents: `${classPrefix}-gauge-widget-form-contents`,
    rangeBuilderRoot: `${classPrefix}-gauge-widget-range-builder`
};
export const getWidgetFormStyles = memoizeFunction((theme: Theme) => {
    return mergeStyleSets({
        description: [
            classNames.description,
            {
                fontSize: FontSizes.size14,
                color: theme.palette.neutralSecondary
            } as IStyle
        ],
        gaugeWidgetFormContents: [
            classNames.gaugeWidgetFormContents,
            {
                overflowY: 'auto',
                overflowX: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            } as IStyle
        ],
        rangeBuilderRoot: [
            classNames.rangeBuilderRoot,
            {
                paddingTop: 8
            } as IStyle
        ]
    });
});
