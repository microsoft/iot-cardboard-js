import {
    IPropertyListItemStyleProps,
    IPropertyListItemStyles
} from './PropertyListItem.types';
import { CardboardClassNamePrefix } from '../../../../../../Models/Constants/Constants';
import { getIndentation } from './PropertyListItemUtilites';

export const classPrefix = `${CardboardClassNamePrefix}-property-list-item`;
const classNames = {
    root: `${classPrefix}-root`,
    addChild: `${classPrefix}-add-child-button`
};
export const getStyles = (
    props: IPropertyListItemStyleProps
): IPropertyListItemStyles => {
    const { hasChildren, theme } = props;
    const indentation = getIndentation(props.level, hasChildren);
    return {
        root: [
            classNames.root,
            {
                padding: '4px 0px',
                marginLeft: `${indentation}px`
            }
        ],
        addChildButton: [classNames.addChild],
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
                    paddingLeft: 4
                }
            },
            inputIcon: {
                root: {
                    paddingLeft: 4
                }
            },
            childTypeSubMenuIcon: {
                fluentIcon: {
                    paddingTop: 0,
                    paddingBottom: 0
                }
            },
            menuItems: {
                subComponentStyles: {
                    callout: {},
                    menuItem: {
                        '.ms-ContextualMenu-link': {
                            display: 'flex',
                            alignItems: 'center'
                        }
                    }
                }
            }
        }
    };
};
