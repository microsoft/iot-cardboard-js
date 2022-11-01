import {
    IStyle,
    mergeStyleSets,
    useTheme,
    FontSizes,
    IButtonStyles,
    ISeparatorStyles,
    IStackStyles
} from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../Models/Constants';
import {
    getControlBackgroundColor,
    PROPERTY_EDITOR_WIDTH
} from '../../Models/Constants/OatStyleConstants';
import { useExtendedTheme } from '../../Models/Hooks/useExtendedTheme';

const classPrefix = `${CardboardClassNamePrefix}-oat-property-editor`;
const classNames = {
    addPropertyMessageWrap: `${classPrefix}-add-property-message-wrap`,
    container: `${classPrefix}-container`,
    pivotItem: `${classPrefix}-pivot-item`,
    pivot: `${classPrefix}-pivot`,
    templateColumn: `${classPrefix}-templates-column`,
    pivotContentWrap: `${classPrefix}-pivot-content-wrap`,
    row: `${classPrefix}-row`,
    viewTemplatesCta: `${classPrefix}-view-templates-cta`,
    gridRow: `${classPrefix}-grid-row`,
    gridRowPropertyHeading: `${classPrefix}-grid-row-property-heading`,
    propertyHeadingIcon: `${classPrefix}-property-heading-icon`,
    paddingWrap: `${classPrefix}-padding-wrap`,
    rowSpaceBetween: `${classPrefix}-row-space-between`,
    propertiesWrap: `${classPrefix}-properties-wrap`,
    propertySelector: `${classPrefix}-row-property-selector`,
    propertySelectorAddMore: `${classPrefix}-row-property-selector-add-more`,
    propertySelectorNestItem: `${classPrefix}-row-property-selector-nest-item`,
    propertySelectorPropertyListHeader: `${classPrefix}-row-property-selector-property-list-header`,
    propertySelectorHeader: `${classPrefix}-row-property-selector-header`,
    propertySelectorHidden: `${classPrefix}-selector-hidden`,
    iconClosePropertySelector: `${classPrefix}-icon-close-property-selector`,
    propertyTagsWrapFirst: `${classPrefix}-property-tags-wrap-first`,
    propertyTagsWrapSecond: `${classPrefix}-property-tags-wrap-second`,
    propertyTagsWrapThird: `${classPrefix}-property-tags-wrap-third`,
    propertyTag: `${classPrefix}-property-tag`,
    iconAddProperty: `${classPrefix}-icon-add-property`,
    templateItem: `${classPrefix}-template-item`,
    templateItemEntered: `${classPrefix}-template-item-entered`,
    templateItemDragging: `${classPrefix}-template-item-dragging`,
    enumItem: `${classPrefix}-enum-item`,
    mapItemInputWrap: `${classPrefix}-map-input-wrap-item`,
    mapItemWrap: `${classPrefix}-map-item-wrap`,
    propertyItem: `${classPrefix}-property-item`,
    propertyItemTypeText: `${classPrefix}-property-item-type-text`,
    propertyItemNest: `${classPrefix}-property-item-nest`,
    propertyItemNested: `${classPrefix}-property-item-nested`,
    propertyItemNestMainItem: `${classPrefix}-property-item-nest-main-item`,
    propertyItemEntered: `${classPrefix}-property-item-entered`,
    propertyItemDragging: `${classPrefix}-property-item-dragging`,
    propertyItemIconWrapMore: `${classPrefix}-property-item-icon-wrap-more`,
    propertyItemIconMoreSubMenu: `${classPrefix}-property-item-icon-more-sub-menu`,
    propertyItemIcon: `${classPrefix}-property-item-icon`,
    propertyListRelativeWrap: `${classPrefix}-property-list-relative-wrap`,
    propertyNestedItemRelativeWrap: `${classPrefix}-property-nested-item-relative-wrap`,
    propertySubMenuItemIcon: `${classPrefix}-property-sub-item-icon`,
    propertySubMenuItemIconRemove: `${classPrefix}-property-sub-item-icon-remove`,
    addPropertyBar: `${classPrefix}-property-bar`,
    addPropertyBarPropertyListWrap: `${classPrefix}-property-bar-list-wrap`,
    addPropertyBarIcon: `${classPrefix}-property-bar-icon`,
    addPropertyBarIconNestItem: `${classPrefix}-property-bar-icon-nest-item`,
    modal: `${classPrefix}-modal`,
    modalRow: `${classPrefix}-modal-row`,
    modalRowLanguageSelection: `${classPrefix}-modal-row-language-selection`,
    modalRowFlexEnd: `${classPrefix}-modal-row-flex-end`,
    modalRowSpaceBetween: `${classPrefix}-modal-row-space-between`,
    modalTexField: `${classPrefix}-modal-tex-field`,
    booleanIcon: `${classPrefix}-boolean-icon`,
    button: `${classPrefix}-button`,
    typeTextField: `${classPrefix}-type-text-field`,
    typeTextFieldPlaceholder: `${classPrefix}-type-text-field-placeholder`,
    regionButton: `${classPrefix}-region-button`
};

const OATEditorPivotContentHeightAdjustment = 82;

export const getPropertyInspectorStyles = () => {
    const theme = useExtendedTheme();
    return mergeStyleSets({
        root: [
            classNames.container,
            {
                backgroundColor: getControlBackgroundColor(theme),
                display: 'flex',
                flexDirection: 'row',
                height: '100%',
                maxHeight: '80vh',
                padding: 16,
                width: PROPERTY_EDITOR_WIDTH
            } as IStyle
        ],
        pivot: [
            classNames.pivot,
            {
                width: '100%',
                '[role="tabpanel"]': {
                    height: `calc(100% - ${OATEditorPivotContentHeightAdjustment}px)`
                },
                zIndex: '201'
            } as IStyle
        ],
        pivotItem: [
            classNames.pivotItem,
            {
                height: '100%',
                backgroundColor: 'transparent'
            } as IStyle
        ],
        templateColumn: [
            classNames.templateColumn,
            {
                width: '80%',
                height: '100%'
            } as IStyle
        ],
        row: [
            classNames.container,
            {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            } as IStyle
        ],
        viewTemplatesCta: [
            classNames.viewTemplatesCta,
            {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                ':hover': {
                    backgroundColor:
                        theme.semanticColors.primaryButtonTextDisabled
                }
            } as IStyle
        ],
        gridRow: [
            classNames.gridRow,
            {
                display: 'grid',
                gridTemplateColumns: '50% 50%',
                alignItems: 'center',
                minHeight: '38px'
            } as IStyle
        ],
        gridRowPropertyHeading: [
            classNames.gridRowPropertyHeading,
            {
                display: 'grid',
                gridTemplateColumns: '50% 50%',
                padding: '8px'
            } as IStyle
        ],
        propertyHeadingIcon: [
            classNames.propertyHeadingIcon,
            {
                marginRight: '10px',
                color: theme.semanticColors.menuIcon
            } as IStyle
        ],
        propertyListHeaderWrap: [
            classNames.paddingWrap,
            {
                padding: '8px',
                position: 'relative'
            }
        ],
        rowSpaceBetween: [
            classNames.rowSpaceBetween,
            {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            } as IStyle
        ],
        propertiesWrap: [
            classNames.propertiesWrap,
            {
                position: 'relative',
                paddingBottom: '30px',
                overflowX: 'hidden',
                height: '100%'
            } as IStyle
        ],
        addPropertyMessageWrap: [
            classNames.addPropertyMessageWrap,
            {
                position: 'relative',
                width: 'fit-content',
                height: 'fit-content',
                button: {
                    height: 'fit-content',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0',
                    span: {
                        display: 'flex',
                        alignItems: 'center',
                        pointerEvents: 'none',
                        i: {
                            pointerEvents: 'none'
                        }
                    }
                },
                ':hover': {
                    cursor: 'pointer'
                }
            }
        ],
        propertySelector: [
            classNames.propertySelector,
            {
                display: 'flex',
                flexDirection: 'row',
                backgroundColor: theme.semanticColors.listBackground,
                borderRadius: '4px',
                borderBottom: `1px solid ${theme.semanticColors.variantBorder}`,
                zIndex: 100,
                boxShadow: '0px 5px 10px 1px rgba(0,0,0,0.05)',
                position: 'fixed',
                left: '-50%',
                bottom: '42%',
                height: 'fit-content'
            }
        ],
        propertySelectorHidden: [
            classNames.propertySelectorHidden,
            {
                opacity: 0,
                pointerEvents: 'none'
            }
        ],
        propertySelectorNestItem: [
            classNames.propertySelectorNestItem,
            {
                display: 'flex',
                flexDirection: 'row',
                backgroundColor: theme.semanticColors.listBackground,
                borderRadius: '4px',
                borderBottom: `1px solid ${theme.semanticColors.variantBorder}`,
                zIndex: 100,
                boxShadow: '0px 5px 10px 1px rgba(0,0,0,0.05)',
                position: 'absolute',
                left: '-50%',
                bottom: '20%'
            }
        ],
        propertySelectorAddMore: [
            classNames.propertySelector,
            {
                display: 'flex',
                flexDirection: 'row',
                backgroundColor: theme.semanticColors.listBackground,
                borderRadius: '4px',
                borderBottom: `1px solid ${theme.semanticColors.variantBorder}`,
                zIndex: 100,
                boxShadow: '0px 5px 10px 1px rgba(0,0,0,0.05)',
                position: 'absolute',
                left: '-50%',
                bottom: '75%'
            }
        ],
        propertySelectorHeader: [
            classNames.propertySelectorHeader,
            {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                padding: '8px',
                paddingRight: '12px',
                marginBottom: '6px'
            }
        ],
        iconClosePropertySelector: [
            classNames.iconClosePropertySelector,
            {
                fontSize: FontSizes.size10
            } as IStyle
        ],
        propertyTagsWrapFirst: [
            classNames.propertyTagsWrapFirst,
            {
                display: 'grid',
                gridTemplateColumns: '20% 20% 20% 20% 20%',
                justifyContent: 'center',
                flexWrap: 'wrap',
                padding: '0px 8px',
                minWidth: ' fit-content',
                backgroundColor: theme.semanticColors.buttonBackgroundDisabled
            } as IStyle
        ],
        propertyTagsWrapSecond: [
            classNames.propertyTagsWrapSecond,
            {
                display: 'grid',
                gridTemplateColumns: '50% 50%',
                justifyContent: 'center',
                flexWrap: 'wrap',
                padding: '0px 8px',
                minWidth: ' fit-content'
            } as IStyle
        ],
        propertyTagsWrapThird: [
            classNames.propertyTagsWrapThird,
            {
                display: 'grid',
                gridTemplateColumns: '33% 33% 33%',
                justifyContent: 'center',
                flexWrap: 'wrap',
                padding: '0px 8px',
                minWidth: ' fit-content'
            } as IStyle
        ],
        propertyTag: [
            classNames.propertyTag,
            {
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'transparent',
                borderRadius: '2px',
                marginRight: '4px',
                marginBottom: '1px',
                minWidth: '30px',
                minHeight: '30px',
                width: '30px',
                ':hover': {
                    backgroundColor:
                        theme.semanticColors.buttonBackgroundPressed,
                    cursor: 'pointer'
                },
                path: {
                    fill: theme.semanticColors.menuItemText
                },
                circle: {
                    stroke: theme.semanticColors.menuItemText
                },
                line: {
                    stroke: theme.semanticColors.menuItemText
                }
            } as IStyle
        ],
        iconAddProperty: [
            classNames.iconAddProperty,
            {
                marginRight: '10px'
            } as IStyle
        ],
        templateItem: [
            classNames.templateItem,
            {
                display: 'grid',
                gridTemplateColumns: '50% 30% 10%',
                alignItems: 'center',
                padding: '12px 8px',
                borderBottom: `1px solid ${theme.semanticColors.variantBorder}`,
                cursor: 'grab',
                ':active': {
                    cursor: 'grabbing'
                },
                ':hover': {
                    backgroundColor:
                        theme.semanticColors.buttonBackgroundPressed
                }
            } as IStyle
        ],
        templateItemEntered: [
            classNames.templateItemEntered,
            {
                display: 'grid',
                gridTemplateColumns: '60% 30% 10%',
                alignItems: 'center',
                padding: '12px 8px',
                cursor: 'grab',
                borderBottom: `1px solid ${theme.semanticColors.menuIcon}`
            } as IStyle
        ],
        templateItemDragging: [
            classNames.templateItemDragging,
            {
                display: 'grid',
                gridTemplateColumns: '60% 30% 10%',
                alignItems: 'center',
                padding: '12px 8px',
                cursor: 'grab',
                borderBottom: `1px solid ${theme.semanticColors.menuIcon}`,
                '*': {
                    opacity: 0
                }
            } as IStyle
        ],
        enumItem: [
            classNames.enumItem,
            {
                display: 'grid',
                gridTemplateColumns: '10% 35% 35% 10% 10%',
                width: '100%',
                backgroundColor: theme.semanticColors.buttonBackgroundDisabled,
                alignItems: 'center',
                padding: '12px 0px',
                borderBottom: `1px solid ${theme.semanticColors.buttonBackgroundPressed}'`,
                borderRadius: '4px'
            } as IStyle
        ],
        mapItemWrap: [
            classNames.mapItemWrap,
            {
                paddingLeft: '10%',
                margin: '0px 4px',
                borderRadius: '4px',
                backgroundColor: theme.semanticColors.buttonBackgroundDisabled
            } as IStyle
        ],
        mapItemInputWrap: [
            classNames.mapItemInputWrap,
            {
                display: 'grid',
                gridTemplateColumns: '50% 50%',
                width: '100%',
                alignItems: 'center',
                padding: '12px 8px',
                borderBottom: `1px solid ${theme.semanticColors.buttonBackgroundPressed}'`
            } as IStyle
        ],
        propertyListRelativeWrap: [
            classNames.propertyListRelativeWrap,
            {
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                margin: '0, 4px'
            } as IStyle
        ],
        propertyNestedItemRelativeWrap: [
            classNames.propertyNestedItemRelativeWrap,
            {
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
            } as IStyle
        ],
        propertyItem: [
            classNames.propertyItem,
            {
                display: 'grid',
                gridTemplateColumns: '45% 35% 10% 10%',
                width: '100%',
                backgroundColor: theme.semanticColors.listBackground,
                alignItems: 'center',
                padding: '12px 0px',
                cursor: 'grab',
                ':active': {
                    cursor: 'grabbing'
                },
                position: 'relative'
            } as IStyle
        ],
        propertyItemTypeText: [
            classNames.propertyItemTypeText,
            {
                textTransform: 'lowercase'
            } as IStyle
        ],
        propertyItemEntered: [
            classNames.propertyItemEntered,
            {
                display: 'grid',
                gridTemplateColumns: '50% 30% 10% 10%',
                alignItems: 'center',
                padding: '12px 8px',
                borderBottom: `1px solid ${theme.semanticColors.menuIcon}`
            } as IStyle
        ],
        propertyItemDragging: [
            classNames.propertyItemDragging,
            {
                display: 'grid',
                gridTemplateColumns: '50% 30% 10% 10%',
                alignItems: 'center',
                padding: '12px 8px',
                borderBottom: `1px solid ${theme.semanticColors.menuIcon}`,
                '>*': {
                    opacity: 0
                }
            } as IStyle
        ],
        propertyItemNest: [
            classNames.propertyItemNest,
            {
                backgroundColor: 'theme.semanticColors.listBackground',
                alignItems: 'start',
                padding: '12px 0px',
                cursor: 'grab',
                ':active': {
                    cursor: 'grabbing'
                }
            } as IStyle
        ],
        propertyItemNested: [
            classNames.propertyItemNested,
            {
                display: 'grid',
                gridTemplateColumns: '10% 35% 35% 10% 10%',
                width: '100%',
                backgroundColor: theme.semanticColors.buttonBackgroundDisabled,
                alignItems: 'center',
                padding: '8px 0px',
                borderRadius: '4px',
                marginBottom: '8px',
                cursor: 'default'
            } as IStyle
        ],
        propertyItemNestMainItem: [
            classNames.propertyItemNestMainItem,
            {
                display: 'grid',
                gridTemplateColumns: '45% 25% 10%  10% 10%',
                width: '100%',
                alignItems: 'center',
                paddingBottom: '12px',
                position: 'relative',
                cursor: 'grab',
                ':active': {
                    cursor: 'grabbing'
                }
            } as IStyle
        ],
        propertyItemIconWrapMore: [
            classNames.propertyItemIconWrapMore,
            {
                height: 'min-content',
                color: theme.semanticColors.menuIcon,
                position: 'relative'
            } as IStyle
        ],
        propertyItemIconMoreSubMenu: [
            classNames.propertyItemIconMoreSubMenu,
            {
                position: 'absolute',
                backgroundColor: theme.semanticColors.listBackground,
                boxShadow: '0px 5px 10px 1px rgba(0,0,0,0.2)',
                zIndex: 1,
                right: '0px',
                top: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '4px'
            } as IStyle
        ],
        propertyItemIcon: [
            classNames.propertyItemIcon,
            {
                height: 'min-content'
            } as IStyle
        ],
        propertySubMenuItemIcon: [
            classNames.propertySubMenuItemIcon,
            {
                height: 'min-content',
                marginRight: '8px'
            } as IStyle
        ],
        propertySubMenuItemIconRemove: [
            classNames.propertySubMenuItemIconRemove,
            {
                height: 'min-content',
                marginRight: '8px',
                color: theme.semanticColors.errorIcon
            } as IStyle
        ],
        addPropertyBar: [
            classNames.addPropertyBar,
            {
                height: '1px',
                width: '100%',
                backgroundColor: theme.semanticColors.primaryButtonTextDisabled,
                position: 'absolute',
                top: '100%',
                ':hover': {
                    backgroundColor: theme.semanticColors.menuIcon
                },
                button: {
                    height: 'fit-content',
                    position: 'absolute'
                }
            } as IStyle
        ],
        addPropertyBarPropertyListWrap: [
            classNames.addPropertyBarPropertyListWrap,
            {
                position: 'relative',
                height: 'fit-content',
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.2)',
                marginTop: '20px',
                overflow: 'visible',
                overflowX: 'visible',
                minWidth: '100%'
            } as IStyle
        ],
        addPropertyBarIcon: [
            classNames.addPropertyBarIcon,
            {
                position: 'absolute',
                top: '-7px',
                left: '4%',
                zIndex: 1,
                backgroundColor: theme.semanticColors.listBackground,
                color: theme.semanticColors.primaryButtonTextDisabled,
                borderRadius: '100%',
                ':hover': {
                    color: theme.semanticColors.menuIcon
                }
            } as IStyle
        ],
        addPropertyBarIconNestItem: [
            classNames.addPropertyBarIconNestItem,
            {
                position: 'absolute',
                top: '-7px',
                left: '46px',
                zIndex: 1,
                backgroundColor: theme.semanticColors.listBackground,
                color: theme.semanticColors.primaryButtonTextDisabled,
                borderRadius: '100%',
                ':hover': {
                    color: theme.semanticColors.menuIcon
                }
            } as IStyle
        ],
        modal: [
            classNames.modal,
            {
                border: `1px solid ${theme.semanticColors.variantBorder}`,
                borderRadius: '2px',
                padding: '15px 25px',
                minWidth: '600px'
            } as IStyle
        ],
        modalRow: [
            classNames.modalRow,
            {
                display: 'grid',
                width: '100%',
                gridTemplateColumns: '35% 65%',
                alignItems: 'center',
                marginBottom: '15px',
                'div:not(:last-of-type)': {
                    marginRight: '10px'
                }
            } as IStyle
        ],
        modalRowLanguageSelection: [
            classNames.modalRowLanguageSelection,
            {
                display: 'grid',
                gridTemplateColumns: '8% 27% 65%',
                alignItems: 'center',
                marginBottom: '15px',
                'div:not(:last-of-type)': {
                    marginRight: '10px'
                }
            } as IStyle
        ],
        modalRowFlexEnd: [
            classNames.modalRowFlexEnd,
            {
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginBottom: '15px',
                width: '100%',
                'button:not(:last-of-type)': {
                    marginRight: '10px'
                }
            } as IStyle
        ],
        modalRowSpaceBetween: [
            classNames.modalRowSpaceBetween,
            {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px'
            } as IStyle
        ],
        modalTexField: [
            classNames.modalTexField,
            {
                maxWidth: '156px'
            } as IStyle
        ],
        button: [
            classNames.button,
            {
                float: 'rigth'
            } as IStyle
        ],
        typeTextField: [
            classNames.typeTextField,
            {
                marginLeft: '10px',
                height: '38px',
                paddingTop: '12px'
            } as IStyle
        ],
        typeTextFieldPlaceholder: [
            classNames.typeTextFieldPlaceholder,
            {
                marginLeft: '10px',
                height: '38px',
                paddingTop: '12px',
                color: theme.semanticColors.inputPlaceholderText,
                opacity: '.9'
            } as IStyle
        ],
        regionButton: [
            classNames.regionButton,
            {
                marginLeft: '30px'
            } as IStyle
        ]
    });
};

/* Property Editor */

export const getPropertyEditorTextFieldStyles = () => {
    const theme = useTheme();
    return {
        root: {
            border: '2px solid transparent',
            borderRadius: '4px',
            ':hover': {
                border: `2px solid ${theme.semanticColors.variantBorder}`
            },
            ':focus': {
                border: `2px solid ${theme.semanticColors.variantBorder}`
            },
            marginRight: '10px'
        }
    };
};

/* Properties Model Summary */

export const getGeneralPropertiesWrapStyles = () => {
    const theme = useTheme();
    return {
        root: {
            padding: '8px',
            borderBottom: `1px solid ${theme.semanticColors.variantBorder}`
        }
    } as Partial<IStackStyles>;
};

export const getIconWrapFitContentStyles = () => {
    const theme = useTheme();
    return {
        root: {
            color: theme.semanticColors.menuIcon,
            width: 'fit-content'
        }
    } as Partial<IButtonStyles>;
};

/* Property Selector */

export const getPropertySelectorStyles = () => {
    const theme = useTheme();
    return {
        root: {
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: theme.semanticColors.listBackground,
            borderRadius: '4px',
            borderBottom: `1px solid ${theme.semanticColors.variantBorder}`,
            zIndex: 100,
            boxShadow: '0px 5px 10px 1px rgba(0,0,0,0.05)',
            position: 'absolute',
            left: '-50%',
            bottom: '100%'
        }
    };
};

export const getPropertySelectorSeparatorStyles = () => {
    const theme = useTheme();
    return {
        root: {
            width: '100%',
            height: 'fill-available',
            padding: 0,
            margin: '2px 0px',
            ':after': {
                backgroundColor: theme.semanticColors.variantBorder
            }
        }
    } as Partial<ISeparatorStyles>;
};

/* Property List */

export const getPropertyListPivotColumnContentStyles = () => {
    return {
        root: {
            height: '100%'
        }
    } as Partial<IButtonStyles>;
};

export const getPropertyListStackItemStyles = () => {
    return {
        root: {
            overflowY: 'auto',
            '::-webkit-scrollbar': {
                width: '0px',
                opacity: '0'
            }
        }
    } as Partial<IButtonStyles>;
};

/* Property List Item */

export const getPropertyListItemIconWrapStyles = () => {
    const theme = useTheme();
    return {
        root: {
            color: theme.semanticColors.menuIcon,
            width: '100%'
        }
    } as Partial<IButtonStyles>;
};

export const getPropertyListItemIconWrapMoreStyles = () => {
    const theme = useTheme();
    return {
        root: {
            color: theme.semanticColors.menuIcon,
            position: 'relative',
            width: '100%'
        }
    } as Partial<IButtonStyles>;
};

export const getMapItemStyles = () => {
    const theme = useTheme();
    return {
        root: {
            width: '100%',
            padding: '12px 8px',
            borderBottom: `1px solid ${theme.semanticColors.buttonBackgroundPressed}'`
        }
    } as Partial<IStackStyles>;
};

export const getIconMoreSubMenuItemStyles = () => {
    const theme = useTheme();
    return {
        root: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            minWidth: 'max-content',
            width: '100%',
            padding: '8px',
            ':hover': {
                backgroundColor: theme.semanticColors.primaryButtonTextDisabled
            }
        }
    } as Partial<IButtonStyles>;
};

export const getListMapItemTextStyles = () => {
    return {
        root: { padding: '0px 8px' }
    } as Partial<IButtonStyles>;
};

/* Template Column */

export const getTemplateColumnStyles = () => {
    const theme = useTheme();
    return {
        root: {
            width: '90%',
            height: '100%',
            backgroundColor: theme.semanticColors.buttonBackgroundDisabled
        }
    } as Partial<IButtonStyles>;
};
export const getTemplateColumnPaddingStyles = () => {
    return {
        root: {
            padding: '8px'
        }
    } as Partial<IButtonStyles>;
};

/* Property Editor Modal */

export const getModalLabelStyles = () => {
    return {
        root: {
            marginRight: '20px'
        }
    };
};

export const getRadioGroupRowStyles = () => {
    return {
        root: {
            '.ms-ChoiceFieldGroup-flexContainer': {
                display: 'flex',
                justifyContent: 'flex-end',
                'div:not(:last-of-type)': {
                    marginRight: '10px'
                }
            }
        }
    };
};

export const getModalTextFieldStyles = () => {
    return {
        root: {
            width: '100%',
            minWidth: '100%'
        }
    };
};

export const getCancelButtonStyles = () => {
    return {
        root: {
            zIndex: '202',
            marginRight: '8px',
            float: 'right'
        }
    } as IButtonStyles;
};
export const getSaveButtonStyles = () => {
    return {
        root: {
            zIndex: '202',
            float: 'right'
        }
    } as IButtonStyles;
};
