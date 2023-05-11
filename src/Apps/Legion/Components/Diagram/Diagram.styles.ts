import { TDiagramClassNames } from './Diagram.types';
import { makeStyles } from '@fluentui/react-components';

export const useClassNames = makeStyles<TDiagramClassNames>({
    root: {
        '-webkit-transform': 'scale(.8)',
        '-webkit-transform-origin': '0 0'
    },
    annotationWrapper: {
        width: 'max-content',
        position: 'absolute'
    }
});
