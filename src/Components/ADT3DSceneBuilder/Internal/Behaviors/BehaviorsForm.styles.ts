import { memoizeFunction, mergeStyleSets, Theme } from '@fluentui/react';

export const getStyles = memoizeFunction((_theme: Theme) => {
    return mergeStyleSets({
        pivotItem: { height: 'calc(100% - 68px)' }
    });
});
