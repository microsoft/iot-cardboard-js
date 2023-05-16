import { TDiagramTabClassNames } from './DiagramTab.types';
import { makeStyles, shorthands } from '@fluentui/react-components';

export const useClassNames = makeStyles<TDiagramTabClassNames>({
    root: {},
    diagramSelectorWrapper: {
        ...shorthands.padding('20px', '0'),
        display: 'grid',
        gridTemplateRows: 'repeat(1fr)',
        justifyItems: 'start',
        ...shorthands.gap('2px')
    },
    diagramSelector: {
        width: '316px'
    },
    diagramWrapper: {
        width: '100%',
        height: '500px'
    }
});
