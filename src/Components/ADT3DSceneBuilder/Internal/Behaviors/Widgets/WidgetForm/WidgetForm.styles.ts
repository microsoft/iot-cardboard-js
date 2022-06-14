import {
    memoizeFunction,
    mergeStyleSets,
    FontSizes,
    IStyle,
    Theme
} from '@fluentui/react';
import { leftPanelBuilderBlock } from '../../../../../../Resources/Styles/BaseStyles';

const classPrefix = 'widget-form';
const classNames = {
    description: `${classPrefix}-description`,
    widgetFormContents: `${classPrefix}-widget-form-contents`,
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
        widgetFormContents: [
            classNames.widgetFormContents,
            leftPanelBuilderBlock,
            {
                overflowY: 'auto',
                overflowX: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1
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
