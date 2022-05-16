import {
    ISceneListModeToggleStyleProps,
    ISceneListModeToggleStyles
} from './SceneListModeToggle.types';

const classPrefix = 'cb-scene-list-toggle';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    _props: ISceneListModeToggleStyleProps
): ISceneListModeToggleStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
