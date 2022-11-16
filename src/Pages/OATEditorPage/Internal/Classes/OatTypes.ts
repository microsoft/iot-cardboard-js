import { FitViewFunc, Node, XYPosition } from 'react-flow-renderer';

import { ProjectData } from './ProjectData';

export interface IOATFile {
    id: string;
    data: ProjectData;
}

interface ViewportHelperFunctionOptions {
    duration?: number;
}
/**
 * This is the type of the react flow instance ref
 * NOTE: there are more actions than this, this is just what we were using.
 */
export interface IReactFlowInstance {
    getNodes: () => Node[];
    zoomOut: (options?: ViewportHelperFunctionOptions) => void;
    zoomTo: (options?: ViewportHelperFunctionOptions) => void;
    zoomIn: (options?: ViewportHelperFunctionOptions) => void;
    fitView: FitViewFunc;
    project: (position: XYPosition) => XYPosition;
}
