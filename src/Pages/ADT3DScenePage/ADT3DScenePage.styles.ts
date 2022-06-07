import { IStyle, memoizeFunction, mergeStyleSets } from '@fluentui/react';
import { SCENE_PAGE_OUTER_OFFSET } from '../../Models/Constants/StyleConstants';

export const scenePageClassPrefix = 'cb-scene-page';
const classNames = {
    container: `${scenePageClassPrefix}-container`,
    header: `${scenePageClassPrefix}-header`
};

export const getStyles = memoizeFunction((isBuildMode: boolean) => {
    return mergeStyleSets({
        container: [
            classNames.container,
            {
                backgroundColor: 'var(--cb-color-bg-canvas)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                padding: isBuildMode
                    ? `0px ${SCENE_PAGE_OUTER_OFFSET}px 0px 0px`
                    : SCENE_PAGE_OUTER_OFFSET,
                overflowX: 'auto'
            }
        ],
        header: [
            classNames.header,
            {
                display: 'flex'
            } as IStyle
        ]
    });
});
