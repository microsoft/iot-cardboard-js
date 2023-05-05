import { CONTENT_HEIGHT } from '../../../../WizardShell.styles';
import { IGraphTabStyles } from './GraphTab.types';
import {
    IProcessedStyleSet,
    mergeStyleSets,
    memoizeFunction
} from '@fluentui/react';

export const getStyles = memoizeFunction(
    (): IProcessedStyleSet<IGraphTabStyles> => {
        return mergeStyleSets({
            root: {
                height: CONTENT_HEIGHT - 40 // Height - pivot
            }
        });
    }
);
