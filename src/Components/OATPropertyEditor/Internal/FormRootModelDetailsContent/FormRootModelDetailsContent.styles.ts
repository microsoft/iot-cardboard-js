import { CardboardClassNamePrefix } from '../../../../Models/Constants/Constants';
import {
    IFormRootModelDetailsContentStyleProps,
    IFormRootModelDetailsContentStyles
} from './FormRootModelDetailsContent.types';

export const classPrefix = `${CardboardClassNamePrefix}-form-root-model-details`;
const classNames = {
    root: `${classPrefix}-root`,
    label: `${classPrefix}-label`,
    labelWithCallout: `${classPrefix}-label-with-callout`
};
const LABEL_MARGIN = 20;
export const getStyles = (
    _props: IFormRootModelDetailsContentStyleProps
): IFormRootModelDetailsContentStyles => {
    return {
        root: [classNames.root, {}],
        label: [
            classNames.label,
            {
                marginRight: LABEL_MARGIN
            }
        ],
        labelWithTooltip: [
            classNames.labelWithCallout,
            {
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'row',
                marginRight: LABEL_MARGIN
            }
        ],
        subComponentStyles: {
            writeableChoiceGroup: {
                flexContainer: {
                    display: 'flex',
                    flexDirection: 'row'
                }
            }
        }
    };
};
