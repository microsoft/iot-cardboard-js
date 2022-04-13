import {
    IStyle,
    memoizeFunction,
    mergeStyleSets,
    Theme
} from '@fluentui/react';

export const sceneLayersClassPrefix = 'cb-scene-layers';

const classNames = {};

export const getStyles = memoizeFunction((_theme?: Theme) => {
    return mergeStyleSets({});
});
