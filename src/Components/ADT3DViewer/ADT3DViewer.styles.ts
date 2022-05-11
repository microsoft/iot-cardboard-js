import { VIEWER_HEADER_TOP_OFFSET } from '../../Models/Constants/StyleConstants';
import {
    IADT3DViewerStyles,
    IADT3DViewerStyleProps
} from './ADT3DViewer.types';

export const classPrefix = 'cb-adt-3d-viewer';
const classNames = {
    root: `${classPrefix}-root`,
    wrapper: `${classPrefix}-wrapper`,
    layersDropdown: `${classPrefix}-layers-picker`
};
export const getStyles = (
    _props: IADT3DViewerStyleProps
): IADT3DViewerStyles => {
    return {
        root: [classNames.root, {}],
        wrapper: [
            classNames.wrapper,
            {
                height: '100%',
                position: 'relative',
                width: '100%'
            }
        ],
        layersPicker: [
            classNames.layersDropdown,
            {
                position: 'relative'
            }
        ],
        subComponentStyles: {
            headerStack: {
                root: {
                    alignItems: 'center',
                    position: 'absolute',
                    right: 0,
                    top: VIEWER_HEADER_TOP_OFFSET,
                    zIndex: 999
                }
            }
        }
    };
};
