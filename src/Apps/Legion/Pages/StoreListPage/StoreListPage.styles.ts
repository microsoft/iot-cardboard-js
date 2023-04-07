import { IStyle, memoizeFunction, mergeStyleSets } from '@fluentui/react';

export const getStyles = memoizeFunction(() =>
    mergeStyleSets({
        header: {
            marginBottom: 0
        } as IStyle
    })
);
