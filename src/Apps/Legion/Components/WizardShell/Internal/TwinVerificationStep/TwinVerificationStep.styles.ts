import {
    ITwinVerificationStepStyleProps,
    ITwinVerificationStepStyles
} from './TwinVerificationStep.types';
import { CardboardClassNamePrefix } from '../../../../../../Models/Constants';

const classPrefix = `${CardboardClassNamePrefix}-twinverificationstep`;
const classNames = {
    root: `${classPrefix}-root`
};

// export const TWINVERIFICATIONSTEP_CLASS_NAMES = classNames;
export const getStyles = (
    _props: ITwinVerificationStepStyleProps
): ITwinVerificationStepStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
