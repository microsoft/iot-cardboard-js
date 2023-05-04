import { CONTENT_HEIGHT } from '../../../../WizardShell.styles';
import { ITypesTabStyles } from './TypesTab.types';
import {
    IProcessedStyleSet,
    mergeStyleSets,
    memoizeFunction
} from '@fluentui/react';

export const getStyles = memoizeFunction(
    (): IProcessedStyleSet<ITypesTabStyles> => {
        return mergeStyleSets({
            root: {
                maxHeight: CONTENT_HEIGHT - 44, // Height - (pivot + extra padding)
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                rowGap: 8,
                marginTop: 8
            }
        });
    }
);
