import { memoizeFunction, mergeStyleSets, IStyle } from '@fluentui/react';

export const TwinPropertyBuilderClassPrefix = 'cb-twin-property-builder';

const classNames = {
    toggleContainer: `${TwinPropertyBuilderClassPrefix}-toggle-container`
};

export const getStyles = memoizeFunction(() => {
    return mergeStyleSets({
        toggleContainer: [
            classNames.toggleContainer,
            {
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center'
            } as IStyle
        ]
    });
});
