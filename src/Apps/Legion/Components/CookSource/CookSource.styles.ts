import { ICookSourceStyles } from './CookSource.types';
import {
    IProcessedStyleSet,
    mergeStyleSets,
    memoizeFunction
} from '@fluentui/react';

export const getStyles = memoizeFunction(
    (): IProcessedStyleSet<ICookSourceStyles> => {
        return mergeStyleSets({
            root: {}
        });
    }
);
