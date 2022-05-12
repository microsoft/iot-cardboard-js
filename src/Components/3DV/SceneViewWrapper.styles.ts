import {
    BUILDER_CAMERA_CONTROLS_BOTTOM_OFFSET,
    VIEWER_CAMERA_CONTROLS_BOTTOM_OFFSET,
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
            rightHeaderControlsStack: {
                root: {
                    alignItems: 'center',
                    // hacks for dayz. will remove when we pull the control up a layer
                    right: mode === WrapperMode.Viewer ? 420 : 272,
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
                            ? VIEWER_CAMERA_CONTROLS_BOTTOM_OFFSET
                            : BUILDER_CAMERA_CONTROLS_BOTTOM_OFFSET
                }
            }
        }
    };
};
