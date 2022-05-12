import {
    BUILDER_FOOTER_BOTTOM_OFFSET,
    ELEMENTS_PANEL_BUTTON_BOTTOM_OFFSET,
    SCENE_PAGE_OUTER_OFFSET,
    VIEWER_HEADER_TOP_OFFSET
} from '../../Models/Constants/StyleConstants';
import { WrapperMode } from './SceneView.types';
import {
    ISceneViewWrapperStyleProps,
    ISceneViewWrapperStyles
} from './SceneViewWrapper.types';

const classPrefix = 'cb-scene-view-wrapper';

const classNames = {
    root: `${classPrefix}-root`,
    cameraControls: `${classPrefix}-camera-controls`,
    leftHeader: `${classPrefix}-left-header-controls`,
    button: `${classPrefix}-button`,
    callout: `${classPrefix}-callout`,
    calloutCheckbox: `${classPrefix}-callout-checkbox`,
    calloutTitle: `${classPrefix}-callout-title`
};

export const getStyles = (
    props: ISceneViewWrapperStyleProps
): ISceneViewWrapperStyles => {
    const { mode } = props;
    return {
        /** provide a hook for custom styling by consumers */
        root: [classNames.root],
        cameraControlsContainer: [classNames.cameraControls],
        leftHeaderControlsContainer: [classNames.leftHeader],
        subComponentStyles: {
            leftHeaderControlsStack: {
                root: {
                    alignItems: 'center',
                    left: 20,
                    position: 'absolute',
                    top: VIEWER_HEADER_TOP_OFFSET,
                    zIndex: 1
                }
            },
            cameraControlsStack: {
                root: {
                    position: 'absolute',
                    display: 'flex',
                    width: '100%',
                    bottom:
                        mode === WrapperMode.Viewer
                            ? ELEMENTS_PANEL_BUTTON_BOTTOM_OFFSET
                            : SCENE_PAGE_OUTER_OFFSET +
                              BUILDER_FOOTER_BOTTOM_OFFSET
                }
            }
        }
    };
};
