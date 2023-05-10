import { makeStyles, shorthands } from '@fluentui/react-components';
import { TEntitiesTabStyles } from './EntitiesTab.types';

export const EntityTabCSSVar = '--legion-entity-root-max-height';

export const useEntitiesTabClassNames = makeStyles<TEntitiesTabStyles>({
    root: {
        maxHeight: `var(${EntityTabCSSVar})`,
        overflowY: 'auto',
        overflowX: 'hidden'
    },
    columnWrapper: {
        display: 'flex',
        alignItems: 'center',
        height: '100%'
    },
    idColumn: {
        ...shorthands.overflow('hidden'),
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    newEntityIcon: {
        minWidth: '10px',
        ...shorthands.margin('-16px', '0px', '0px', '2px')
    },
    columnHeader: {
        fontWeight: '600'
    }
});
