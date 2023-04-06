import { mergeStyleSets } from '@fluentui/react';
import { IExtendedPalette } from '../../../../../../../Theming/Theme.types';

// Style
export const getModelListsStyles = (palette: IExtendedPalette) => {
    return mergeStyleSets({
        root: {
            display: 'flex',
            flexDirection: 'column',
            rowGap: 16,
            paddingTop: 8
        },
        tableContainer: {
            display: 'flex',
            columnGap: 8,
            border: `1px solid ${palette.glassyBorder}`,
            background: `${palette.glassyBackground75}`,
            padding: 12,
            borderRadius: 4
        },
        // Model side
        leftContainer: {
            display: 'flex',
            alignItems: 'center',
            columnGap: 4
        },
        modelNameText: {
            margin: 0
        },
        dot: {
            width: 12,
            height: 12,
            borderRadius: 6
        },
        // Property side
        rightContainerText: {
            margin: 0,
            marginBottom: 8
        },
        checkboxContainer: {
            display: 'flex',
            columnGap: 8
        }
    });
};
