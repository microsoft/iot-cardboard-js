import { IStyle, FontSizes } from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../Models/Constants';
import { IOATHeaderStyleProps, IOATHeaderStyles } from './OATHeader.types';

const classPrefix = `${CardboardClassNamePrefix}-oat-header`;
const classNames = {
    root: `${classPrefix}-root`,
    listSubMenu: `${classPrefix}-list-sub-menu`,
    listSubMenuItem: `${classPrefix}-list-sub-menu-item`,
    logo: `${classPrefix}-logo`,
    menuComponent: `${classPrefix}-menu-component`,
    modal: `${classPrefix}-modal`,
    modalRow: `${classPrefix}-modal-row`,
    modalRowFlexEnd: `${classPrefix}-modal-row-flex-end`,
    optionIcon: `${classPrefix}-option-icon`,
    options: `${classPrefix}-options`,
    projectName: `${classPrefix}-project-name`,
    search: `${classPrefix}-search`,
    searchComponent: `${classPrefix}-search-component`,
    uploadDirectoryInput: `${classPrefix}-upload-directory-input`
};

export const getStyles = (props: IOATHeaderStyleProps): IOATHeaderStyles => {
    const { theme } = props;
    return {
        root: [
            classNames.root,
            {
                display: 'grid',
                gridTemplateColumns: '100%',
                backgroundColor: theme.semanticColors.bodyBackground
            } as IStyle
        ],
        projectName: [
            classNames.projectName,
            {
                margin: 0,
                paddingLeft: 4
            }
        ],
        logo: [
            classNames.logo,
            {
                color: theme.semanticColors.bodyText,
                height: '100%',
                padding: '4%'
            } as IStyle
        ],
        menuComponent: [
            classNames.menuComponent,
            {
                display: 'grid',
                gridTemplateColumns: '40% 40% 20%'
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
        options: [
            classNames.options,
            {
                height: '100%',
                padding: '4%',
                display: 'grid',
                gridTemplateColumns: '10% 10% 10% 70%'
            } as IStyle
        ],
        search: [
            classNames.search,
            {
                height: '100%',
                padding: '1%'
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
        subComponentStyles: {
            commandBar: {
                root: {
                    padding: '0px'
                }
            }
        }
    };
};

export const getPromptTextStyles = () => {
    return {
        root: {
            fontSize: '16px'
        }
    };
};
