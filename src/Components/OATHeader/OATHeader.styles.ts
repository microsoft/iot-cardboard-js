import { IStyle, mergeStyleSets, useTheme, FontSizes } from '@fluentui/react';
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
    menuIcon: `${classPrefix}-menu-icon`
};

export const getHeaderStyles = () => {
    const theme = useTheme();
    return mergeStyleSets({
        container: [
            classNames.container,
            {
                display: 'grid',
                gridTemplateColumns: '100%',
                height: '5px'
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
        menuIcon: [
            classNames.menuIcon,
            {
                fontSize: FontSizes.size14,
                color: theme.semanticColors.actionLink
            } as IStyle
        ]
    });
};
