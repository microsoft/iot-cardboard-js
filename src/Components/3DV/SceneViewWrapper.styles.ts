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
    leftHeader: `${classPrefix}-left-header-controls`,
    button: `${classPrefix}-button`,
    callout: `${classPrefix}-callout`,
    calloutCheckbox: `${classPrefix}-callout-checkbox`,
    calloutTitle: `${classPrefix}-callout-title`,
    errorMessage: `${classPrefix}-error-message`
};

export const getStyles = (
    props: ISceneViewWrapperStyleProps
): ISceneViewWrapperStyles => {
    const { mode } = props;
    return {
        /** provide a hook for custom styling by consumers */
        root: [classNames.root],
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
                    bottom:
                        mode === WrapperMode.Viewer
                            ? VIEWER_CAMERA_CONTROLS_BOTTOM_OFFSET
                            : BUILDER_CAMERA_CONTROLS_BOTTOM_OFFSET,
                    display: 'flex',
                    position: 'absolute',
                    width: '100%',
                    // hacks for dayz cause Matt said so
                    '.cb-camera-controls-root .ms-FocusZone': {
                        marginLeft: mode === WrapperMode.Viewer ? 360 : 'auto'
                    }
                }
            }
        }
    };
};
