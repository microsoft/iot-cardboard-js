import { IStyle } from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../../Models/Constants/Constants';
import {
    IImportSubMenuStyleProps,
    IImportSubMenuStyles
} from './ImportSubMenu.types';
import { getSubMenuStyles } from './Shared.styles';

const classPrefix = `${CardboardClassNamePrefix}-oat-import-sub-menu`;
const classNames = {
    root: `${classPrefix}-root`
};

export const getStyles = (
    props: IImportSubMenuStyleProps
): IImportSubMenuStyles => {
    const { theme } = props;
    return {
        root: [
            classNames.root,
            {
                display: 'grid',
                gridTemplateColumns: '100%',
                height: '44px',
                backgroundColor: theme.semanticColors.bodyBackground
            } as IStyle
        ],
        subComponentStyles: {
            ...getSubMenuStyles(props)
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
