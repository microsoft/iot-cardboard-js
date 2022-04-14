import {
    FontWeights,
    IStyle,
    ITextStyles,
    memoizeFunction,
    mergeStyleSets,
    Theme
} from '@fluentui/react';

export const sceneLayersClassPrefix = 'cb-scene-layers';

const classNames = {
    container: `${sceneLayersClassPrefix}-container`,
    body: `${sceneLayersClassPrefix}-body`,
    footer: `${sceneLayersClassPrefix}-footer`
};

export const getStyles = memoizeFunction((_theme?: Theme) => {
    return mergeStyleSets({
        container: [
            classNames.container,
            {
                minWidth: 300
            } as IStyle
        ],
        footer: [
            classNames.footer,
            {
                width: '100%',
                position: 'absolute',
                bottom: 0,
                height: 60,
                display: 'flex',
                alignItems: 'center',
                borderTop: '1px solid var(--cb-color-modal-border)',
                paddingLeft: 20
            } as IStyle
        ],
        body: [
            classNames.body,
            {
                height: 'calc(100% - 60px)',
                overflowY: 'auto',
                minHeight: 200,
                padding: 20,
                paddingTop: 8
            } as IStyle
        ]
    });
});

export const sectionHeaderStyles: Partial<ITextStyles> = {
    root: {
        fontWeight: FontWeights.semibold
    }
};
