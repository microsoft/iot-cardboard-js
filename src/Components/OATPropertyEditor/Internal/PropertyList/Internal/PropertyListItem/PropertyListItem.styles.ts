import {
    IPropertyListItemStyleProps,
    IPropertyListItemStyles
} from './PropertyListItem.types';
import { CardboardClassNamePrefix } from '../../../../../../Models/Constants/Constants';

export const classPrefix = `${CardboardClassNamePrefix}-property-list-item`;
const classNames = {
    root: `${classPrefix}-root`,
    addChild: `${classPrefix}-add-child-button`
};
export const getStyles = (
    props: IPropertyListItemStyleProps
): IPropertyListItemStyles => {
    const { theme } = props;
    return {
        root: [
            classNames.root,
            {
                padding: '4px 0px'
                // ':hover .cb-property-list-item-add-child-button, :focus-within .cb-property-list-item-add-child-button': {
                //     opacity: 1
                // }
            }
        ],
        addChildButton: [
            classNames.addChild,
            {
                // opacity: 0
            }
        ],
        buttonSpacer: [{ width: 32 }],
        subComponentStyles: {
            expandButton: {
                icon: {
                    color: theme.semanticColors.bodyText
                }
            },
            nameTextField: {
                fieldGroup: {
                    backgroundColor: 'transparent'
                },
                field: {
                    // paddingRight: 8,
                    paddingLeft: 0
                }
                // icon: {
                //     left: 8
                // }
            }
        }
    };
};
