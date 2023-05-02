import {
        ITablePickerStyles
    } from './TablePicker.types';
    import { IProcessedStyleSet, mergeStyleSets, memoizeFunction } from '@fluentui/react';

    export const getStyles = memoizeFunction((): IProcessedStyleSet<ITablePickerStyles> => {
        return mergeStyleSets({
            root: {}
        });
    });

