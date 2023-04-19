import {
    FontWeights,
    IProcessedStyleSet,
    mergeStyleSets
} from '@fluentui/react';
import { IWizardShellStyles } from './WizardShell.types';
import { IExtendedTheme } from '../../../../Theming/Theme.types';

// export const WIZARDSHELL_CLASS_NAMES = classNames;
export const getStyles = (
    theme: IExtendedTheme,
    hasSecondaryActions: boolean
): IProcessedStyleSet<IWizardShellStyles> => {
    return mergeStyleSets({
        root: {
            height: '100%',
            display: 'grid',
            gridTemplateColumns: '140px auto',
            gridTemplateRows: '64px auto 64px',
            gridTemplateAreas: `
                "left header"
                "left wizard"
                "left footer"
            `
        },
        leftNav: {
            gridArea: 'left',
            borderRight: `1px solid ${theme.palette.glassyBorder}`,
            padding: 16
        },
        headerNav: {
            gridArea: 'header',
            borderBottom: `1px solid ${theme.palette.glassyBorder}`,
            display: 'flex',
            columnGap: 8,
            alignItems: 'center',
            paddingLeft: 16
        },
        headerText: {
            fontWeight: FontWeights.semibold,
            margin: 0
        },
        wizardContainer: {
            gridArea: 'wizard',
            padding: 16
        },
        footer: {
            gridArea: 'footer',
            borderTop: `1px solid ${theme.palette.glassyBorder}`,
            display: 'flex',
            justifyContent: hasSecondaryActions ? 'space-between' : 'flex-end'
        },
        nextButtonContainer: {
            alignSelf: 'center',
            marginRight: 32,
            marginBottom: 8
        },
        additionalButtonsContainer: {
            alignSelf: 'center',
            marginLeft: 32,
            marginBottom: 8
        }
    });
};
