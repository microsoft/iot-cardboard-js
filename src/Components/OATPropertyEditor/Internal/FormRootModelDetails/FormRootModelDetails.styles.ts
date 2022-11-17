import { CardboardClassNamePrefix } from '../../../../Models/Constants/Constants';
import {
    IFormRootModelDetailsStyleProps,
    IFormRootModelDetailsStyles
} from './FormRootModelDetails.types';

export const classPrefix = `${CardboardClassNamePrefix}-form-root-model-details`;
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    _props: IFormRootModelDetailsStyleProps
): IFormRootModelDetailsStyles => {
    return {
        root: [classNames.root, {}],
        subComponentStyles: {}
    };
};
