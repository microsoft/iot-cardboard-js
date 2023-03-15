import { IOatProjectData } from './ProjectData';

export interface IOATFile {
    id: string;
    data: IOatProjectData;
}
export enum IOatPropertyEditorTabKey {
    Properties = 'PROPERTIES',
    DTDL = 'JSON'
}

interface ViewportHelperFunctionOptions {
    duration?: number;
}
/**
 * This is the type of the react flow instance ref
 * NOTE: there are more actions than this, this is just what we were using.
 */
export interface IReactFlowInstance {
    zoomOut: (options?: ViewportHelperFunctionOptions) => void;
    zoomTo: (options?: ViewportHelperFunctionOptions) => void;
    zoomIn: (options?: ViewportHelperFunctionOptions) => void;
    fitView: () => void; // does take args, so check the docs if you need them
    project: (position: XYPosition) => XYPosition;
}

interface XYPosition {
    x: number;
    y: number;
}
