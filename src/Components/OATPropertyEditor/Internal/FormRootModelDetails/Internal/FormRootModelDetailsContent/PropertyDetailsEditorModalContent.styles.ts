import { CardboardClassNamePrefix } from '../../../../../../Models/Constants/Constants';
import {
    IPropertyDetailsEditorModalContentStyleProps,
    IPropertyDetailsEditorModalContentStyles
} from './PropertyDetailsEditorModalContent.types';

export const classPrefix = `${CardboardClassNamePrefix}-form-root-model-details`;
const classNames = {
    root: `${classPrefix}-root`,
    label: `${classPrefix}-label`,
    labelWithCallout: `${classPrefix}-label-with-callout`,
    splitInput: `${classPrefix}-split-input`
};
const LABEL_MARGIN = 20;
export const getStyles = (
    _props: IPropertyDetailsEditorModalContentStyleProps
): IPropertyDetailsEditorModalContentStyles => {
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
        splitInputColumn: [
            classNames.splitInput,
            {
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'row'
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
