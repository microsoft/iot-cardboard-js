import {
    ITwinVerificationStepStyleProps,
    ITwinVerificationStepStyles
} from './TwinVerificationStep.types';
import { CardboardClassNamePrefix } from '../../../../../../Models/Constants';

const classPrefix = `${CardboardClassNamePrefix}-twinverificationstep`;
const classNames = {
    root: `${classPrefix}-root`,
    content: `${classPrefix}-content`,
    headerContainer: `${classPrefix}-headerContainer`
};

// export const TWINVERIFICATIONSTEP_CLASS_NAMES = classNames;
export const getStyles = (
    _props: ITwinVerificationStepStyleProps
): ITwinVerificationStepStyles => {
    return {
        root: [
            classNames.root,
            {
                height: '100%',
                display: 'flex-box'
            }
        ],
        content: [classNames.content, {}],
        headerContainer: [classNames.headerContainer, {}],
        subComponentStyles: {
            button: {
                root: {
                    position: 'absolute',
                    right: 16,
                    bottom: 0
                }
            }
        }
    };
};
