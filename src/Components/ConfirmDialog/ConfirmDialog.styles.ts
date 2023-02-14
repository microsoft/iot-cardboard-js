import {
    IConfirmDialogStyleProps,
    IConfirmDialogStyles
} from './ConfirmDialog.types';
import { CardboardClassNamePrefix } from '../../Models/Constants/Constants';

const classPrefix = `${CardboardClassNamePrefix}-confirmdialog`;
const classNames = {
    root: `${classPrefix}-root`
};

// export const CONFIRMDIALOG_CLASS_NAMES = classNames;
export const getStyles = (
    _props: IConfirmDialogStyleProps
): IConfirmDialogStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {
            dialog: {
                main: {
                    maxWidth: 450,
                    minHeight: 165
                }
            }
        }
    };
};
