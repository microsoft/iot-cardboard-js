import { TDiagramTabClassNames } from './DiagramTab.types';
import { makeStyles, shorthands } from '@fluentui/react-components';

export const useClassNames = makeStyles<TDiagramTabClassNames>({
    root: {},
    diagramSelector: {
        width: 'fit-content',
        ...shorthands.padding('20px', '0')
    },
    diagramWrapper: {
        width: '1000px',
        height: '540px'
    }
});
