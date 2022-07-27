import {
    memoizeFunction,
    mergeStyleSets,
    IStyle,
    Theme
} from '@fluentui/react';

export const ModelGroupLabelClassPrefix = 'cb-model-group-label';

const classNames = {
    groupBadge: `${ModelGroupLabelClassPrefix}-group-badge`
};

export const getStyles = memoizeFunction((theme: Theme) => {
    return mergeStyleSets({
        groupBadge: [
            classNames.groupBadge,
            {
                borderRadius: 25,
                background: theme.semanticColors.buttonBackground,
                padding: '8px 12px',
                border: `1px solid ${theme.palette.neutralLight}`,
                color: theme.semanticColors.bodyText,
                horizontalAlignment: 'center',
                width: 'fit-content'
            } as IStyle
        ]
    });
});
