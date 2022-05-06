import { IStyle, memoizeFunction, mergeStyleSets } from '@fluentui/react';

export const scenePageClassPrefix = 'cb-scene-page';
const classNames = {
    toggleContainer: `${scenePageClassPrefix}-toggle-container`,
    toggleButtons: `${scenePageClassPrefix}-toggle-buttons`,
    toggleButton: `${scenePageClassPrefix}-toggle-button`
};

export const getStyles = memoizeFunction(() => {
    return mergeStyleSets({
        toggleContainer: [
            classNames.toggleContainer,
            {
                display: 'flex'
            } as IStyle
        ],
        toggleButtons: [
            classNames.toggleButtons,
            {
                marginLeft: 'auto'
            } as IStyle
        ],
        toggleButton: [
            classNames.toggleButton,
            {
                marginRight: '8px'
            } as IStyle
        ]
    });
});
