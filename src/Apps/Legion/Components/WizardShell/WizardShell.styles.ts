import { CardboardClassNamePrefix } from '../../../../Models/Constants';
import {
    IWizardShellStyleProps,
    IWizardShellStyles
} from './WizardShell.types';

const classPrefix = `${CardboardClassNamePrefix}-wizardshell`;
const classNames = {
    root: `${classPrefix}-root`
};

// export const WIZARDSHELL_CLASS_NAMES = classNames;
export const getStyles = (
    _props: IWizardShellStyleProps
): IWizardShellStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
