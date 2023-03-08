import {
    ISampleGraphStyleProps,
    ISampleGraphStyles
} from './SampleGraph.types';
import { CardboardClassNamePrefix } from '../../Models/Constants/Constants';

const classPrefix = `${CardboardClassNamePrefix}-samplegraph`;
const classNames = {
    root: `${classPrefix}-root`
};

// export const SAMPLEGRAPH_CLASS_NAMES = classNames;
export const getStyles = (
    _props: ISampleGraphStyleProps
): ISampleGraphStyles => {
    return {
        root: [classNames.root, { height: '100%' }],
        graphContainer: {
            height: '100%'
        },
        subComponentStyles: {}
    };
};
