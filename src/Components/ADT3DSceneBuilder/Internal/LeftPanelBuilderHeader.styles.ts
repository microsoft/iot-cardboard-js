import { FontSizes } from '@fluentui/react';
import { leftPanelBuilderBlock } from '../../../Resources/Styles/BaseStyles';
import {
    ILeftPanelBuilderHeaderStyleProps,
    ILeftPanelBuilderHeaderStyles
} from './LeftPanelBuilderHeader.types';

const classPrefix = 'cb-left-panel-builder-header';
const classNames = {
    root: `${classPrefix}-root`,
    header: `${classPrefix}-header`,
    subHeader: `${classPrefix}-subheader`,
    subHeaderIcon: `${classPrefix}-subheader-icon`,
    subHeaderText: `${classPrefix}-subheader-text`
};
export const getStyles = (
    props: ILeftPanelBuilderHeaderStyleProps
): ILeftPanelBuilderHeaderStyles => {
    const { theme } = props;
    return {
        root: [classNames.root, leftPanelBuilderBlock],
        header: [
            classNames.header,
            {
                fontWeight: 600,
                margin: 0
            }
        ],
        subHeader: [
            classNames.subHeader,
            {
                color: theme.palette.neutralSecondary,
                fontSize: FontSizes.medium
            }
        ],
        subHeaderIcon: [classNames.subHeaderIcon],
        subHeaderText: [classNames.subHeaderText],
        subComponentStyles: {
            subHeaderStack: {
                root: {
                    alignItems: 'center'
                }
            }
        }
    };
};
