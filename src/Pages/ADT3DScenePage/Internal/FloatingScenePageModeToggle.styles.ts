import { HEADER_BUTTON_HEIGHT } from '../../../Models/Constants/StyleConstants';
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
    props: IFloatingScenePageModeToggleStyleProps
): IFloatingScenePageModeToggleStyles => {
    const { theme } = props;
    return {
        root: [classNames.root],
        subComponentStyles: {
            pivot: {
                link: {
                    background: theme.semanticColors.bodyBackground,
                    height: HEADER_BUTTON_HEIGHT
                }
            }
        }
    };
};
