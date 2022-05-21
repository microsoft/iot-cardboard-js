import { IStyle, memoizeFunction, mergeStyleSets } from '@fluentui/react';
import { SCENE_PAGE_OUTER_OFFSET } from '../../Models/Constants/StyleConstants';

export const scenePageClassPrefix = 'cb-scene-page';
const classNames = {
    container: `${scenePageClassPrefix}-container`,
    header: `${scenePageClassPrefix}-header`
};

export const getStyles = memoizeFunction(() => {
    return mergeStyleSets({
        container: [
            classNames.container,
            {
                backgroundColor: 'var(--cb-color-bg-canvas)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                padding: SCENE_PAGE_OUTER_OFFSET,
                overflowX: 'auto'
            } as IStyle
        ],
        header: [
            classNames.header,
            {
                display: 'flex'
            } as IStyle
        ]
    });
});
