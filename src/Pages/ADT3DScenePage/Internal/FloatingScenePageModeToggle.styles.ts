import { VIEWER_HEADER_TOP_OFFSET } from '../../../Models/Constants/StyleConstants';
import {
    IFloatingScenePageModeToggleStyles,
    IFloatingScenePageModeToggleStyleProps
} from './FloatingScenePageModeToggle.types';

export const classPrefix = 'cb-floating-scene-page-mode-toggle';
const classNames = {
    root: `${classPrefix}-root`,
    layersDropdown: `${classPrefix}-layers-dropdown`
};
export const getStyles = (
    _props: IFloatingScenePageModeToggleStyleProps
): IFloatingScenePageModeToggleStyles => {
    return {
        root: [
            classNames.root
            // {
            //     position: 'absolute',
            //     right: 8,
            //     top: VIEWER_HEADER_TOP_OFFSET,
            //     zIndex: 999
            // }
        ],
        subComponentStyles: {}
    };
};
