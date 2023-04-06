import {
    ITwinVerificationStepStyleProps,
    ITwinVerificationStepStyles
} from './TwinVerificationStep.types';
import { CardboardClassNamePrefix } from '../../../../../../Models/Constants';

const classPrefix = `${CardboardClassNamePrefix}-twinverificationstep`;
const classNames = {
    root: `${classPrefix}-root`,
    content: `${classPrefix}-content`,
    headerContainer: `${classPrefix}-headerContainer`,
    buttonContainer: `${classPrefix}-buttonContainer`
};

// export const TWINVERIFICATIONSTEP_CLASS_NAMES = classNames;
export const getStyles = (
    _props: ITwinVerificationStepStyleProps
): ITwinVerificationStepStyles => {
    return {
        root: [
            classNames.root,
            {
                padding: 8,
                width: '100%'
            }
        ],
        buttonContainer: [
            classNames.buttonContainer,
            {
                alignSelf: 'flex-end'
            }
        ],
        content: [classNames.content],
        headerContainer: [classNames.headerContainer],
        subComponentStyles: {}
    };
};
