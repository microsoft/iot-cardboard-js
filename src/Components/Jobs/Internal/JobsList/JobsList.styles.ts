import { IJobsListStyleProps, IJobsListStyles } from './JobsList.types';

export const classPrefix = 'cb-jobslist';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (_props: IJobsListStyleProps): IJobsListStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
