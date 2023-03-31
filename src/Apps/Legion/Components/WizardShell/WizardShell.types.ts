import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { IExtendedTheme } from '../../../../Theming/Theme.types';
import { IDataManagementAdapter } from '../../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';

export interface IWizardShellProps {
    adapter: IDataManagementAdapter;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<IWizardShellStyleProps, IWizardShellStyles>;
}

export interface IWizardShellStyleProps {
    theme: IExtendedTheme;
}
export interface IWizardShellStyles {
    root: IStyle;
    wizardContainer: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IWizardShellSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IWizardShellSubComponentStyles {}
