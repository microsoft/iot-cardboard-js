import {
    memoizeFunction,
    mergeStyleSets,
    FontSizes,
    IStyle,
    Theme
} from '@fluentui/react';

const classPrefix = 'widget-form';
const classNames = {
    description: `${classPrefix}-description`
};
export const getWidgetFormStyles = memoizeFunction((theme: Theme) => {
    return mergeStyleSets({
        description: [
            classNames.description,
            {
                fontSize: FontSizes.size14,
                color: theme.palette.neutralSecondary
            } as IStyle
        ]
    });
});
