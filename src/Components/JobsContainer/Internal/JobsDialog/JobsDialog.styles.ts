import { IJobsDialogStyleProps, IJobsDialogStyles } from './JobsDialog.types';
import { CardboardClassNamePrefix } from '../../../../Models/Constants/Constants';

const classPrefix = `${CardboardClassNamePrefix}-jobsdialog`;
const classNames = {
    root: `${classPrefix}-root`
};

// export const JOBSDIALOG_CLASS_NAMES = classNames;
export const getStyles = (_props: IJobsDialogStyleProps): IJobsDialogStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
