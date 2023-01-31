import {
    IStyle,
    mergeStyleSets,
    useTheme,
    FontSizes,
    IButtonStyles,
    ISeparatorStyles
} from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../Models/Constants';
import { useExtendedTheme } from '../../Models/Hooks/useExtendedTheme';

const classPrefix = `${CardboardClassNamePrefix}-oat-property-editor`;
const classNames = {
    booleanIcon: `${classPrefix}-boolean-icon`,
    gridRow: `${classPrefix}-grid-row`,
    gridRowPropertyHeading: `${classPrefix}-grid-row-property-heading`,
    iconAddProperty: `${classPrefix}-icon-add-property`,
    iconClosePropertySelector: `${classPrefix}-icon-close-property-selector`,
    modal: `${classPrefix}-modal`,
    modalRow: `${classPrefix}-modal-row`,
    modalRowFlexEnd: `${classPrefix}-modal-row-flex-end`,
    modalRowLanguageSelection: `${classPrefix}-modal-row-language-selection`,
    modalRowSpaceBetween: `${classPrefix}-modal-row-space-between`,
    modalTexField: `${classPrefix}-modal-tex-field`,
    paddingWrap: `${classPrefix}-padding-wrap`,
    pivotContentWrap: `${classPrefix}-pivot-content-wrap`,
    propertiesWrap: `${classPrefix}-properties-wrap`,
    propertyHeadingIcon: `${classPrefix}-property-heading-icon`,
    propertySelectorAddMore: `${classPrefix}-row-property-selector-add-more`,
    propertySelectorPropertyListHeader: `${classPrefix}-row-property-selector-property-list-header`,
    regionButton: `${classPrefix}-region-button`,
    row: `${classPrefix}-row`,
    rowSpaceBetween: `${classPrefix}-row-space-between`,
    templateItem: `${classPrefix}-template-item`,
    templateItemDragging: `${classPrefix}-template-item-dragging`,
    templateItemEntered: `${classPrefix}-template-item-entered`,
    typeTextField: `${classPrefix}-type-text-field`
};

export const getPropertyInspectorStyles = () => {
    const theme = useExtendedTheme();
    return mergeStyleSets({
        row: [
            classNames.row,
            {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
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
        iconClosePropertySelector: [
            classNames.iconClosePropertySelector,
            {
                fontSize: FontSizes.size10
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
