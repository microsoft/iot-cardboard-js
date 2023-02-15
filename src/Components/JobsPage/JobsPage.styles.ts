import { IJobsPageStyleProps, IJobsPageStyles } from './JobsPage.types';
import { CardboardClassNamePrefix } from '../../Models/Constants/Constants';

const classPrefix = `${CardboardClassNamePrefix}-jobspage`;
const classNames = {
    root: `${classPrefix}-root`
};

// export const JOBSPAGE_CLASS_NAMES = classNames;
export const getStyles = (_props: IJobsPageStyleProps): IJobsPageStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
