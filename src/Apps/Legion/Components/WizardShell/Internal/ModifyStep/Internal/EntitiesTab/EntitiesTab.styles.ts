import { IProcessedStyleSet, mergeStyleSets } from '@fluentui/react';
import { IEntitiesTabStyles } from './EntitiesTab.types';
import { CONTENT_HEIGHT } from '../../../../WizardShell.styles';

export const getStyles: IProcessedStyleSet<IEntitiesTabStyles> = mergeStyleSets(
    {
        root: {
            maxHeight: CONTENT_HEIGHT - 40, // Height - pivot
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
            margin: '-16px 0 0 2px'
        }
    }
);
