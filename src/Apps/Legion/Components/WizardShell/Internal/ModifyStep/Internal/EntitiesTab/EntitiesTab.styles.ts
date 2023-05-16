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
        height: '100%',
        minHeight: 'inherit',
        ...shorthands.overflow('hidden')
    },
    idColumn: {
        ...shorthands.overflow('hidden'),
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    columnHeader: {
        fontWeight: '600'
    }
});
