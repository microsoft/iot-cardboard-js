import { BUILDER_HEADER_TOP_OFFSET } from '../../Models/Constants/StyleConstants';
import {
    IADT3DSceneBuilderStyleProps,
    IADT3DSceneBuilderStyles
} from './ADT3DSceneBuilder.types';

export const classPrefix = 'cb-adt-3d-scene-builder';
const classNames = {
    root: `${classPrefix}-root`,
    wrapper: `${classPrefix}-wrapper`,
    layersPicker: `${classPrefix}-layers-picker`
};
export const getStyles = (
    _props: IADT3DSceneBuilderStyleProps
): IADT3DSceneBuilderStyles => {
    return {
        root: [
            classNames.root,
            {
                height: '100%',
                width: '100%'
            }
        ],
        wrapper: [
            classNames.wrapper,
            {
                height: '100%',
                position: 'relative',
                width: '100%'
            }
        ],
        subComponentStyles: {
            headerStack: {
                root: {
                    alignItems: 'center',
                    position: 'absolute',
                    right: 0,
                    top: BUILDER_HEADER_TOP_OFFSET,
                    zIndex: 999
                }
            }
        }
    };
};
