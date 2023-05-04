import { ISaveStepStyleProps, ISaveStepStyles } from './SaveStep.types';
import { CardboardClassNamePrefix } from '../../../../../../Models/Constants';
import { CONTENT_HEIGHT } from '../../WizardShell.styles';

const classPrefix = `${CardboardClassNamePrefix}-savestep`;
const classNames = {
    root: `${classPrefix}-root`
};

// export const SAVESTEP_CLASS_NAMES = classNames;
export const getStyles = (_props: ISaveStepStyleProps): ISaveStepStyles => {
    return {
        root: [
            classNames.root,
            {
                height: CONTENT_HEIGHT
            }
        ],
        subComponentStyles: {}
    };
};
