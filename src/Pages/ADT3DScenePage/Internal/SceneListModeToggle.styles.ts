import { IStyle, memoizeFunction, mergeStyleSets } from '@fluentui/react';

export const scenePageClassPrefix = 'cb-scene-list-toggle';
const classNames = {
    pivotContainer: `${scenePageClassPrefix}-pivot-container`
};

export const getStyles = memoizeFunction(() => {
    return mergeStyleSets({
        pivotContainer: [
            classNames.pivotContainer,
            {
                position: 'absolute',
                right: '20px',
                top: '22px',
                zIndex: '1'
            } as IStyle
        ]
    });
});
