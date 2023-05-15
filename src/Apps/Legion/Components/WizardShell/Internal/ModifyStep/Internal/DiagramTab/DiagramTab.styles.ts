import { TDiagramTabClassNames } from './DiagramTab.types';
import { makeStyles, shorthands } from '@fluentui/react-components';

export const useClassNames = makeStyles<TDiagramTabClassNames>({
    root: {},
    diagramSelector: {
        width: '40%',
        ...shorthands.padding('20px', '0')
    },
    diagramWrapper: {
        width: '100%',
        height: '500px'
    }
});
