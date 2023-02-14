import { IJobsDialogStyleProps, IJobsDialogStyles } from './JobsDialog.types';

export const classPrefix = 'cb-jobsdialog';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (_props: IJobsDialogStyleProps): IJobsDialogStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
