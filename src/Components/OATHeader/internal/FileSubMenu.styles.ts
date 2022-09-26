import { IStyle } from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../../Models/Constants';
import {
    IFileSubMenuStyleProps,
    IFileSubMenuStyles
} from './FileSubMenu.types';
import { getSubMenuStyles } from './Shared.styles';

const classPrefix = `${CardboardClassNamePrefix}-file-sub-menu`;
const classNames = {
    modal: `${classPrefix}-modal`
};
export const getStyles = (
    props: IFileSubMenuStyleProps
): IFileSubMenuStyles => {
    const { theme } = props;
    return {
        modal: [
            classNames.modal,
            {
                border: `1px solid ${theme.semanticColors.variantBorder}`,
                borderRadius: '2px',
                padding: '15px 25px',
                minWidth: '600px'
            } as IStyle
        ],
        subComponentStyles: {
            modal: {
                root: {
                    padding: '0px'
                }
            },
            ...getSubMenuStyles(props)
        }
    };
};
