import { VIEWER_HEADER_TOP_OFFSET } from '../../Models/Constants/StyleConstants';
import {
    IADT3DViewerStyles,
    IADT3DViewerStyleProps
} from './ADT3DViewer.types';

export const classPrefix = 'cb-adt-3d-viewer';
const classNames = {
    root: `${classPrefix}-root`,
    layersDropdown: `${classPrefix}-layers-dropdown`
};
export const getStyles = (
    _props: IADT3DViewerStyleProps
): IADT3DViewerStyles => {
    return {
        root: [classNames.root, {}],
        layersDropdown: [
            classNames.layersDropdown,
            {
                position: 'absolute',
                right: 200,
                top: VIEWER_HEADER_TOP_OFFSET
            }
        ],
        subComponentStyles: {}
    };
};
