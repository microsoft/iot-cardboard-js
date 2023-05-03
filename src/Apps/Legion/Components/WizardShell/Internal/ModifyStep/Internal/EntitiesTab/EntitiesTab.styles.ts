import { IProcessedStyleSet, mergeStyleSets } from '@fluentui/react';
import { IEntitiesTabStyles } from './EntitiesTab.types';

export const getStyles: IProcessedStyleSet<IEntitiesTabStyles> = mergeStyleSets(
    {
        root: {
            maxHeight: 400,
            overflowY: 'auto'
        },
        columnWrapper: {
            display: 'flex',
            alignItems: 'center',
            height: '100%'
        },
        idColumn: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },
        newEntityIcon: {
            minWidth: 10,
            marginTop: -16
        }
    }
);
