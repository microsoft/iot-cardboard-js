import { IStyle, memoizeFunction, mergeStyleSets } from '@fluentui/react';

export const scenePageClassPrefix = 'cb-scene-page';
const classNames = {
    header: `${scenePageClassPrefix}-header`
};

export const getStyles = memoizeFunction(() => {
    return mergeStyleSets({
        header: [
            classNames.header,
            {
                display: 'flex'
            } as IStyle
        ]
    });
});
