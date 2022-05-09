import {
    memoizeFunction,
    mergeStyleSets,
    IStyle,
    Theme
} from '@fluentui/react';

export const ModelLabelClassPrefix = 'cb-model-label';

const classNames = {
    badge: `${ModelLabelClassPrefix}-badge`
};

export const getStyles = memoizeFunction((theme: Theme) => {
    return mergeStyleSets({
        badge: [
            classNames.badge,
            {
                borderRadius: 25,
                background: theme.semanticColors.buttonBackground,
                padding: '8px 16px',
                border: `1px solid ${theme.palette.neutralLight}`,
                color: theme.semanticColors.bodyText,
                width: 'fit-content'
            } as IStyle
        ]
    });
});
