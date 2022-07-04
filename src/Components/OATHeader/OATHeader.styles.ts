import {
    IStyle,
    mergeStyleSets,
    useTheme,
    FontSizes,
    IButtonStyles
} from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../Models/Constants';

const classPrefix = `${CardboardClassNamePrefix}-oat-header`;
const classNames = {
    container: `${classPrefix}-container`,
    searchComponent: `${classPrefix}-search-component`,
    logo: `${classPrefix}-logo`,
    search: `${classPrefix}-search`,
    options: `${classPrefix}-options`,
    menuComponent: `${classPrefix}-menu-component`,
    optionIcon: `${classPrefix}-option-icon`,
    listSubMenu: `${classPrefix}-list-sub-menu`,
    listSubMenuItem: `${classPrefix}-list-sub-menu-item`,
    modal: `${classPrefix}-modal`,
    modalRow: `${classPrefix}-modal-row`,
    modalRowFlexEnd: `${classPrefix}-modal-row-flex-end`
};

export const getHeaderStyles = () => {
    const theme = useTheme();
    return mergeStyleSets({
        container: [
            classNames.container,
            {
                display: 'grid',
                gridTemplateColumns: '100%',
                height: '44px',
                backgroundColor: theme.semanticColors.bodyBackground
            } as IStyle
        ],
        searchComponent: [
            classNames.searchComponent,
            {
                backgroundColor: theme.semanticColors.bodyBackground,
                display: 'grid',
                gridTemplateColumns: '20% 60% 20%',
                height: '100%'
            } as IStyle
        ],
        logo: [
            classNames.logo,
            {
                color: theme.semanticColors.bodyText,
                height: '100%',
                padding: '4%'
            } as IStyle
        ],
        search: [
            classNames.search,
            {
                height: '100%',
                padding: '1%'
            } as IStyle
        ],
        options: [
            classNames.options,
            {
                height: '100%',
                padding: '4%',
                display: 'grid',
                gridTemplateColumns: '10% 10% 10% 70%'
            } as IStyle
        ],
        menuComponent: [
            classNames.menuComponent,
            {
                display: 'grid',
                gridTemplateColumns: '20% 60% 20%'
            } as IStyle
        ],
        optionIcon: [
            classNames.optionIcon,
            {
                fontSize: FontSizes.size20,
                paddingLeft: '50%',
                color: theme.semanticColors.actionLink
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
                '& div:not(:last-of-type)': {
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
                '& button:not(:last-of-type)': {
                    marginRight: '10px'
                }
            } as IStyle
        ],
        modalRowCenterItem: [
            classNames.modalRowFlexEnd,
            {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '25px',
                width: '100%',
                '& button:not(:last-of-type)': {
                    marginRight: '10px'
                }
            } as IStyle
        ]
    });
};

export const getSubMenuItemStyles: IStyle = () => {
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

export const getSubMenuStyles: IStyle = () => {
    const theme = useTheme();
    return {
        root: {
            position: 'absolute',
            backgroundColor: theme.semanticColors.listBackground,
            boxShadow: '0px 5px 10px 1px rgba(0,0,0,0.2)',
            zIndex: 1,
            right: '0px',
            top: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '4px',
            width: '400px'
        }
    } as Partial<IButtonStyles>;
};

export const getPromptTextStyles: IStyle = () => {
    return {
        root: {
            fontSize: '16px'
        }
    };
};

export const getCommandBarStyles: IStyle = () => {
    return {
        root: {
            padding: '0px'
        }
    };
};
