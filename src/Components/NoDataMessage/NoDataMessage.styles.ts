import {
    FontWeights,
    IStyle,
    ITextStyles,
    memoizeFunction,
    mergeStyleSets
} from '@fluentui/react';

export const noDataMessageClassPrefix = 'cb-no-data-message';

const classNames = {
    container: `${noDataMessageClassPrefix}-container`
};

export const getStyles = memoizeFunction(() => {
    return mergeStyleSets({
        container: [
            classNames.container,
            {
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                paddingTop: 20
            } as IStyle
        ]
    });
});

export const sectionHeaderStyles: Partial<ITextStyles> = {
    root: {
        fontWeight: FontWeights.semibold,
        marginBottom: 8,
        marginTop: 4,
        display: 'block'
    }
};

export const noLayersDescriptionStyles: Partial<ITextStyles> = {
    root: {
        textAlign: 'center',
        width: '80%'
    }
};
