import { CardboardClassNamePrefix } from '../../../../Models/Constants/Constants';
import {
    IFormRootModelDetailsStyleProps,
    IFormRootModelDetailsStyles
} from './FormRootModelDetails.types';

export const classPrefix = `${CardboardClassNamePrefix}-form-root-model-details`;
const classNames = {
    root: `${classPrefix}-root`,
    label: `${classPrefix}-label`,
    labelRequired: `${classPrefix}-label-required`
};
export const getStyles = (
    _props: IFormRootModelDetailsStyleProps
): IFormRootModelDetailsStyles => {
    return {
        root: [classNames.root, {}],
        label: [
            classNames.root,
            {
                marginRight: 20
            }
        ],
        subComponentStyles: {}
    };
};
