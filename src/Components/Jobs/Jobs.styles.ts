import { IJobsStyleProps, IJobsStyles } from './Jobs.types';
import { CardboardClassNamePrefix } from '../../Models/Constants';

export const classPrefix = `${CardboardClassNamePrefix}-jobs`;
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (_props: IJobsStyleProps): IJobsStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
