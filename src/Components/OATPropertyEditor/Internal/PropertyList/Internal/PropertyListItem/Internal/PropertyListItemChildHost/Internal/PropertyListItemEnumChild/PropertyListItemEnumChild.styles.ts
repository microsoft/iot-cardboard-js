import {
    IPropertyListItemEnumChildStyleProps,
    IPropertyListItemEnumChildStyles
} from './PropertyListItemEnumChild.types';
import { CardboardClassNamePrefix } from '../../../../../../../../../../Models/Constants/Constants';
import { getIndentation } from '../../../../PropertyListItemUtilites';

export const classPrefix = `${CardboardClassNamePrefix}-propertylistitemenumchild`;
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    props: IPropertyListItemEnumChildStyleProps
): IPropertyListItemEnumChildStyles => {
    const { level, theme } = props;
    const indentation = getIndentation(level, false);
    return {
        root: [
            classNames.root,
            {
                alignItems: 'center',
                marginLeft: `${indentation}px`,
                padding: '4px 0px'
            }
        ],
        container: [
            {
                display: 'flex'
            }
        ],
        buttonSpacer: [{ width: 32, flexShrink: '0 !important' }],
        subComponentStyles: {
            icon: {
                root: {
                    border: `1px solid ${theme.semanticColors.inputBorder}`,
                    borderRadius: theme.effects.roundedCorner4
                },
                fluentIcon: {
                    padding: 8
                }
            },
            keyField: {
                root: {
                    flex: 1.15
                },
                fieldGroup: {
                    backgroundColor: 'transparent'
                }
            },
            valueTextField: {
                root: {
                    flex: 0.85
                    // marginRight: '72px' // 32px*2 for buttons + 4px*2 for spacing
                },
                fieldGroup: {
                    backgroundColor: 'transparent'
                }
            },
            valueNumberField: {
                root: {
                    flex: 0.85
                    // marginRight: '72px' // 32px*2 for buttons + 4px*2 for spacing
                },
                input: {
                    backgroundColor: 'transparent'
                }
            }
        }
    };
};
