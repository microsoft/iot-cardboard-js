import { IStyle } from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../Models/Constants';
import { IOATHeaderStyleProps, IOATHeaderStyles } from './OATHeader.types';

const classPrefix = `${CardboardClassNamePrefix}-oat-header`;
const classNames = {
    root: `${classPrefix}-root`,
    menuComponent: `${classPrefix}-menu-component`,
    projectName: `${classPrefix}-project-name`,
    switchSubMenuItem: `${classPrefix}-switch-sub-menu-item`,
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
                overflow: 'hidden',
                paddingLeft: 4,
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            }
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
