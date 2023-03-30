import {
    IGraphVisualizerStyleProps,
    IGraphVisualizerStyles
} from './GraphVisualizer.types';
import { CardboardClassNamePrefix } from '../../../../Models/Constants/Constants';

const classPrefix = `${CardboardClassNamePrefix}-GraphVisualizer`;
const classNames = {
    root: `${classPrefix}-root`
};

// export const GraphVisualizer_CLASS_NAMES = classNames;
export const getStyles = (
    _props: IGraphVisualizerStyleProps
): IGraphVisualizerStyles => {
    return {
        root: [classNames.root, { height: '100%' }],
        graphContainer: {
            height: '100%'
        },
        subComponentStyles: {}
    };
};
