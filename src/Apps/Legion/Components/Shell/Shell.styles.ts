import { CardboardClassNamePrefix } from '../../../../Models/Constants';
import { IShellStyleProps, IShellStyles } from './Shell.types';

const classPrefix = `${CardboardClassNamePrefix}-shell`;
const classNames = {
    root: `${classPrefix}-root`
};

// export const SHELL_CLASS_NAMES = classNames;
export const getStyles = (_props: IShellStyleProps): IShellStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
