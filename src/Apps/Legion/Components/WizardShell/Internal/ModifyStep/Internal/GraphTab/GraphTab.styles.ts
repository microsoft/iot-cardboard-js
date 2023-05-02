import { IGraphTabStyles } from './GraphTab.types';
import {
    IProcessedStyleSet,
    mergeStyleSets,
    memoizeFunction
} from '@fluentui/react';

export const getStyles = memoizeFunction(
    (): IProcessedStyleSet<IGraphTabStyles> => {
        return mergeStyleSets({
            root: {}
        });
    }
);
