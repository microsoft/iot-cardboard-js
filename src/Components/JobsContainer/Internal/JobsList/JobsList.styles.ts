import { IJobsListStyleProps, IJobsListStyles } from './JobsList.types';
import { CardboardClassNamePrefix } from '../../../../Models/Constants/Constants';

const classPrefix = `${CardboardClassNamePrefix}-jobslist`;
const classNames = {
    root: `${classPrefix}-root`
};

// export const JOBSLIST_CLASS_NAMES = classNames;
export const getStyles = (_props: IJobsListStyleProps): IJobsListStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
