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
                minWidth: 300,
                display: 'flex',
                flexDirection: 'column'
            } as IStyle
        ],
        footer: [
            classNames.footer,
            {
                width: '100%',
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
                minHeight: 100,
                maxHeight: 200,
                flexGrow: 1,
                overflowY: 'auto',
                padding: 20,
                paddingTop: 8
            } as IStyle
        ]
    });
});

export const sectionHeaderStyles: Partial<ITextStyles> = {
    root: {
        fontWeight: FontWeights.semibold,
        marginBottom: 8,
        display: 'block'
    }
};
