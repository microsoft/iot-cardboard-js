import { TDiagramClassNames } from './Diagram.types';
import { makeStyles } from '@fluentui/react-components';

export const useClassNames = makeStyles<TDiagramClassNames>({
    root: {
        width: '100%',
        height: '100%',
        position: 'relative'
    },
    spinnerWrapper: {
        position: 'absolute',
        left: '50%',
        top: '50%'
    },
    annotationWrapper: {
        width: 'max-content',
        position: 'absolute'
    }
});
