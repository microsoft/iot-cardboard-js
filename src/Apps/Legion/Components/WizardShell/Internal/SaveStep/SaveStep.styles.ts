import { ISaveStepStyleProps, ISaveStepStyles } from './SaveStep.types';
import { CardboardClassNamePrefix } from '../../../../../../Models/Constants';

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
                height: '440px'
            }
        ],
        subComponentStyles: {}
    };
};
