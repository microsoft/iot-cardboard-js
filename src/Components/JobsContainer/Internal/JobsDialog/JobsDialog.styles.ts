import { IJobsDialogStyleProps, IJobsDialogStyles } from './JobsDialog.types';
import { CardboardClassNamePrefix } from '../../../../Models/Constants/Constants';

const classPrefix = `${CardboardClassNamePrefix}-jobsdialog`;
const classNames = {
    root: `${classPrefix}-root`,
    errorText: `${classPrefix}-errorText`
};

export const getStyles = ({
    theme
}: IJobsDialogStyleProps): IJobsDialogStyles => {
    return {
        root: [classNames.root],
        errorText: [
            classNames.errorText,
            {
                color: theme.semanticColors.errorText
            }
        ],
        subComponentStyles: {}
    };
};
