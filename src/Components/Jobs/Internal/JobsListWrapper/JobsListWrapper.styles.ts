import {
    IJobsListWrapperStyleProps,
    IJobsListWrapperStyles
} from './JobsListWrapper.types';

export const classPrefix = 'cb-jobslistwrapper';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    _props: IJobsListWrapperStyleProps
): IJobsListWrapperStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
