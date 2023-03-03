import {
    IJobsContainerStyleProps,
    IJobsContainerStyles
} from './JobsContainer.types';
import { CardboardClassNamePrefix } from '../../Models/Constants/Constants';

const classPrefix = `${CardboardClassNamePrefix}-jobscontainer`;
const classNames = {
    root: `${classPrefix}-root`
};

// export const JOBSCONTAINER = classNames;
export const getStyles = (
    _props: IJobsContainerStyleProps
): IJobsContainerStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
