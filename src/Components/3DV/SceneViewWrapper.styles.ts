import { VIEWER_HEADER_TOP_OFFSET } from '../../Models/Constants/StyleConstants';
import {
    ISceneViewWrapperStyleProps,
    ISceneViewWrapperStyles
} from './SceneViewWrapper.types';

const classPrefix = 'cb-scene-view-wrapper';

const classNames = {
    root: `${classPrefix}-root`,
    centerHeader: `${classPrefix}-center-header-controls`,
    leftHeader: `${classPrefix}-left-header-controls`,
    button: `${classPrefix}-button`,
    callout: `${classPrefix}-callout`,
    calloutCheckbox: `${classPrefix}-callout-checkbox`,
    calloutTitle: `${classPrefix}-callout-title`
};

export const getStyles = (
    _props: ISceneViewWrapperStyleProps
): ISceneViewWrapperStyles => {
    return {
        /** provide a hook for custom styling by consumers */
        root: [classNames.root],
        centerHeaderControlsContainer: [classNames.centerHeader],
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
            centerHeaderControlsStack: {
                root: {
                    position: 'absolute',
                    display: 'flex',
                    width: '100%',
                    top: VIEWER_HEADER_TOP_OFFSET
                }
            }
        }
    };
};
