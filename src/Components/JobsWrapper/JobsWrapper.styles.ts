import {
    IJobsWrapperStyleProps,
    IJobsWrapperStyles
} from './JobsWrapper.types';
import { CardboardClassNamePrefix } from '../../Models/Constants/Constants';

const classPrefix = `${CardboardClassNamePrefix}-jobswrapper`;
const classNames = {
    root: `${classPrefix}-root`
};

// export const JOBSWRAPPER_CLASS_NAMES = classNames;
export const getStyles = (
    _props: IJobsWrapperStyleProps
): IJobsWrapperStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
