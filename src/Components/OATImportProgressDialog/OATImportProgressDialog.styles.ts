import {
    IOATImportProgressDialogStyleProps,
    IOATImportProgressDialogStyles
} from './OATImportProgressDialog.types';
import { CardboardClassNamePrefix } from '../../Models/Constants/Constants';

const classPrefix = `${CardboardClassNamePrefix}-oatimportprogressdialog`;
const classNames = {
    root: `${classPrefix}-root`
};

export const getStyles = (
    _props: IOATImportProgressDialogStyleProps
): IOATImportProgressDialogStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
