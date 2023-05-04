import { IProcessedStyleSet, mergeStyleSets } from '@fluentui/react';
import { IEntitiesTabStyles } from './EntitiesTab.types';
import { CONTENT_HEIGHT } from '../../../../WizardShell.styles';

export const getStyles: IProcessedStyleSet<IEntitiesTabStyles> = mergeStyleSets(
    {
        root: {
            maxHeight: CONTENT_HEIGHT - 40, // Height - pivot
            overflowY: 'auto'
        }
    }
);
