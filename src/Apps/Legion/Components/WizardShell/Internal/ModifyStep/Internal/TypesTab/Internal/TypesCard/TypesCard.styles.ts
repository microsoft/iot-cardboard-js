import { IExtendedTheme } from '../../../../../../../../../../Theming/Theme.types';
import { ITypesCardStyles } from './TypesCard.types';
import {
    IProcessedStyleSet,
    mergeStyleSets,
    memoizeFunction,
    FontWeights
} from '@fluentui/react';

export const getStyles = memoizeFunction(
    (theme: IExtendedTheme): IProcessedStyleSet<ITypesCardStyles> => {
        return mergeStyleSets({
            root: {
                display: 'flex',
                border: `${theme.palette.glassyBorder} 1px solid`,
                marginRight: 8,
                borderRadius: 4
            },
            leftSide: {
                width: '200px',
                display: 'flex',
                flexDirection: 'column',
                rowGap: 8,
                margin: 16
            },
            rightSide: {
                flexGrow: 1,
                margin: 8
            },
            leftSideTitle: {
                marginBottom: 0,
                marginTop: 4,
                fontWeight: FontWeights.semibold
            },
            kindContainer: {
                display: 'inline-flex',
                alignItems: 'center',
                marginBottom: 8
            },
            kindText: { marginTop: 0, marginBottom: 0 }
        });
    }
);
