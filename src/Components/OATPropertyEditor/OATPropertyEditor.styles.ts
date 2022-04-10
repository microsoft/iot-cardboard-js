import { IStyle, mergeStyleSets, useTheme, FontSizes } from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../Models/Constants';

const classPrefix = `${CardboardClassNamePrefix}-oat-header`;
const classNames = {
    container: `${classPrefix}-container`,
    pivot: `${classPrefix}-pivot`,
    templateColumn: `${classPrefix}-templates-column`,
    pivotContentWrap: `${classPrefix}-pivot-content-wrap`,
    gridGeneralPropertiesWrap: `${classPrefix}-general-properties-wrap`,
    row: `${classPrefix}-row`,
    viewTemplatesCta: `${classPrefix}-view-templates-cta`,
    gridRow: `${classPrefix}-grid-row`,
    gridRowPropertyHeading: `${classPrefix}-grid-row-property-heading`,
    propertyHeadingIcon: `${classPrefix}-property-heading-icon`,
    paddingWrap: `${classPrefix}-padding-wrap`,
    rowSpaceBetween: `${classPrefix}-row-space-between`,
    propertiesWrap: `${classPrefix}-properties-wrap`,
    propertySelector: `${classPrefix}-row-property-selector`,
    propertySelectorHeader: `${classPrefix}-row-property-selector-header`,
    iconClosePropertySelectorWrap: `${classPrefix}-icon-close-property-selector-wrap`,
    iconClosePropertySelector: `${classPrefix}-icon-close-property-selector`,
    propertyTagsWrap: `${classPrefix}-property-tags-wrap`,
    propertyTag: `${classPrefix}-property-tag`,
    separator: `${classPrefix}-separator`,
    iconAddProperty: `${classPrefix}-icon-add-property`,
    templateItem: `${classPrefix}-template-item`,
    templateItemEntered: `${classPrefix}-template-item-entered`,
    templateItemDragging: `${classPrefix}-template-item-dragging`,
    propertyItem: `${classPrefix}-property-item`,
    propertyItemEntered: `${classPrefix}-property-item-entered`,
    propertyItemDragging: `${classPrefix}-property-item-dragging`,
    propertyItemIconWrap: `${classPrefix}-property-item-icon-wrap`,
    propertyItemIcon: `${classPrefix}-property-item-icon`,
    addPropertyBar: `${classPrefix}-property-bar`,
    addPropertyBarIcon: `${classPrefix}-property-bar-icon`,
    propertyItemTextField: `${classPrefix}-property-item-text-field`,
    modal: `${classPrefix}-modal`,
    modalColumnLeftItem: `${classPrefix}-modal-column-left-item`,
    modalRowSpaceBetween: `${classPrefix}-modal-row-space-between`,
    modalTexField: `${classPrefix}-modal-tex-field`
};

export const getPropertyInspectorStyles = () => {
    const theme = useTheme();
    return mergeStyleSets({
        container: [
            classNames.container,
            {
                height: '100%',
                position: 'fixed',
                right: 0,
                display: 'flex',
                flexDirection: 'row'
            } as IStyle
        ],
        pivot: [
            classNames.pivot,
            {
                width: '440px',
                backgroundColor: theme.semanticColors.listBackground
            } as IStyle
        ],
        templateColumn: [
            classNames.templateColumn,
            {
                width: '305px',
                height: '100%',
                backgroundColor: '#eef0f2'
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
                    backgroundColor: '#eaeced'
                }
            } as IStyle
        ],
        gridGeneralPropertiesWrap: [
            classNames.gridGeneralPropertiesWrap,
            {
                padding: '8px',
                borderBottom: '1px solid #e5ecf1'
            } as IStyle
        ],
        gridRow: [
            classNames.gridRow,
            {
                display: 'grid',
                gridTemplateColumns: '50% 50%',
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
        paddingWrap: [
            classNames.paddingWrap,
            {
                padding: '8px'
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
                position: 'relative'
            } as IStyle
        ],
        propertySelector: [
            classNames.propertySelector,
            {
                position: 'absolute',
                top: 0,
                right: '99.5%',
                width: '205px',
                minHeight: '200px',
                backgroundColor: '#fafafa',
                borderRadius: '4px',
                border: '1px solid #c1cdd8',
                zIndex: 1
            } as IStyle
        ],
        propertySelectorHeader: [
            classNames.propertySelectorHeader,
            {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px'
            }
        ],
        iconClosePropertySelectorWrap: [
            classNames.iconClosePropertySelector,
            {
                height: 'unset'
            } as IStyle
        ],
        iconClosePropertySelector: [
            classNames.iconClosePropertySelector,
            {
                fontSize: FontSizes.size10
            } as IStyle
        ],
        propertyTagsWrap: [
            classNames.propertyTagsWrap,
            {
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                padding: '0 8px',
                marginBottom: '8px'
            } as IStyle
        ],
        propertyTag: [
            classNames.propertyTag,
            {
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.semanticColors.listBackground,
                border: '1px solid #c1cdd8',
                borderRadius: '2px',
                padding: '2px 5px',
                marginRight: '4px',
                marginBottom: '4px',
                ':hover': {
                    backgroundColor: '#eeeeee',
                    cursor: 'pointer'
                }
            } as IStyle
        ],
        separator: [
            classNames.separator,
            {
                width: '100%',
                height: '1px',
                backgroundColor: '#e5ecf1'
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
                gridTemplateColumns: '60% 30% 10%',
                alignItems: 'center',
                padding: '12px 8px',
                borderBottom: '1px solid #e5ecf1',
                cursor: 'grab',
                ':active': {
                    cursor: 'grabbing'
                },
                ':hover': {
                    backgroundColor: '#eaeced'
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
                '& *': {
                    opacity: 0
                }
            } as IStyle
        ],
        propertyItem: [
            classNames.propertyItem,
            {
                display: 'grid',
                gridTemplateColumns: '50% 30% 10% 10%',
                alignItems: 'center',
                padding: '12px 8px',
                borderBottom: '1px solid #e5ecf1',
                cursor: 'grab',
                ':active': {
                    cursor: 'grabbing'
                }
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
                '& *': {
                    opacity: 0
                }
            } as IStyle
        ],
        propertyItemIconWrap: [
            classNames.propertyItemIconWrap,
            {
                height: 'min-content',
                color: theme.semanticColors.menuIcon
            } as IStyle
        ],
        propertyItemIcon: [
            classNames.propertyItemIcon,
            {
                height: 'min-content'
            } as IStyle
        ],
        addPropertyBar: [
            classNames.addPropertyBar,
            {
                height: '1px',
                width: '100%',
                backgroundColor: theme.semanticColors.menuIcon,
                position: 'relative',
                top: '100%'
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
                borderRadius: '100%',
                color: theme.semanticColors.menuIcon
            } as IStyle
        ],
        propertyItemTextField: [
            classNames.propertyItemTextField,
            {
                border: '2px solid transparent',
                borderRadius: '4px',

                ':hover': {
                    border: '2px solid #9bb2c3'
                },
                ':focus': {
                    border: '2px solid #9bb2c3'
                },
                marginRight: '10px'
            } as IStyle
        ],
        modal: [
            classNames.modal,
            {
                border: '1px solid #9bb2c3',
                borderRadius: '2px',
                padding: '15px 25px',
                minWidth: '400px'
            } as IStyle
        ],
        modalColumnLeftItem: [
            classNames.modalColumnLeftItem,
            {
                marginRight: '20px'
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
        ]
    });
};
