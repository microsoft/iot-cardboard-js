import { IProcessedStyleSet, mergeStyleSets } from '@fluentui/react';
import { IEntitiesTabStyles } from './EntitiesTab.types';

export const getStyles: IProcessedStyleSet<IEntitiesTabStyles> = mergeStyleSets(
    {
        root: {
            maxHeight: 400,
            overflowY: 'auto'
        }
    }
);
