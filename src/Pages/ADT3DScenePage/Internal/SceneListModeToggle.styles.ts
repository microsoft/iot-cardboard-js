import { IStyle, memoizeFunction, mergeStyleSets } from '@fluentui/react';

export const scenePageClassPrefix = 'cb-scene-list-toggle';
const classNames = {
    pivot: `${scenePageClassPrefix}-pivot`
};

export const getStyles = memoizeFunction(() => {
    return mergeStyleSets({
        pivot: [
            classNames.pivot,
            {
                marginLeft: 'auto'
            } as IStyle
        ]
    });
});
