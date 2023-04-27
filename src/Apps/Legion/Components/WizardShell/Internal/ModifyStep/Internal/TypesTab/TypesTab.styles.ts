import { ITypesTabStyles } from './TypesTab.types';
import {
    IProcessedStyleSet,
    mergeStyleSets,
    memoizeFunction
} from '@fluentui/react';

export const getStyles = memoizeFunction(
    (): IProcessedStyleSet<ITypesTabStyles> => {
        return mergeStyleSets({
            root: {
                maxHeight: 400,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                rowGap: 8,
                marginTop: 8
            }
        });
    }
);
