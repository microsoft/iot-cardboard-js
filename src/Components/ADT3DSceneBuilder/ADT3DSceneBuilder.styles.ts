import {
    BUILDER_CONTROLS_TOP_OFFSET,
    SCENE_PAGE_OUTER_OFFSET
} from '../../Models/Constants/StyleConstants';
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
                display: 'flex',
                height: '100%',
                width: '100%'
            }
        ],
        wrapper: [
            classNames.wrapper,
            {
                flexGrow: 1,
                position: 'relative',
                padding: `${SCENE_PAGE_OUTER_OFFSET}px 0px`
            }
        ],
        subComponentStyles: {
            headerStack: {
                root: {
                    alignItems: 'center',
                    position: 'absolute',
                    right: 0,
                    top: BUILDER_CONTROLS_TOP_OFFSET,
                    zIndex: 999
                }
            }
        }
    };
};
