import { CardboardClassNamePrefix } from '../../../../Models/Constants';
import {
    IWizardShellStyleProps,
    IWizardShellStyles
} from './WizardShell.types';

const classPrefix = `${CardboardClassNamePrefix}-wizardshell`;
const classNames = {
    root: `${classPrefix}-root`,
    content: `${classPrefix}-content`,
    wizardContainer: `${classPrefix}-wizardContainer`
};

// export const WIZARDSHELL_CLASS_NAMES = classNames;
export const getStyles = (
    _props: IWizardShellStyleProps
): IWizardShellStyles => {
    return {
        root: [classNames.root],
        wizardContainer: [
            classNames.wizardContainer,
            {
                padding: 8,
                '.cb-stepper-wizard': {
                    justifyContent: 'start'
                }
            }
        ],
        content: [
            classNames.content,
            {
                flex: 1,
                maxWidth: 600
            }
        ],
        subComponentStyles: {}
    };
};
