import {
    IModelPropertyHeaderStyleProps,
    IModelPropertyHeaderStyles
} from './ModelPropertyHeader.types';
import { CardboardClassNamePrefix } from '../../../../Models/Constants/Constants';
import { FontSizes, FontWeights, IStyle } from '@fluentui/react';

export const classPrefix = `${CardboardClassNamePrefix}-modelpropertyheader`;
const classNames = {
    root: `${classPrefix}-root`,
    sectionHeaderRoot: `${classPrefix}-header-root`,
    sectionHeaderContainer: `${classPrefix}-header-container`,
    sectionHeaderTitle: `${classPrefix}-header-title`,
    sectionHeaderSubTitle: `${classPrefix}-header-subtitle`
};
export const getStyles = (
    props: IModelPropertyHeaderStyleProps
): IModelPropertyHeaderStyles => {
    const { theme } = props;
    const ellipseText: IStyle = {
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    };
    const ellipseStart: IStyle = {
        ...ellipseText,
        direction: 'RTL',
        textAlign: 'left'
    };
    return {
        root: [classNames.root],
        sectionHeaderRoot: [
            classNames.sectionHeaderRoot,
            {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }
        ],
        sectionHeaderIcon: [{ paddingRight: 8 }],
        sectionHeaderContainer: [
            classNames.sectionHeaderContainer,
            {
                overflow: 'hidden',
                flex: 1
            }
        ],
        sectionTitle: [
            classNames.sectionHeaderTitle,
            {
                margin: 0,
                padding: 0,
                fontSize: FontSizes.size16,
                fontWeight: FontWeights.semibold,
                ...ellipseText
            }
        ],
        sectionSubtitle: [
            classNames.sectionHeaderSubTitle,
            {
                fontSize: FontSizes.size12,
                color: theme.semanticColors.disabledText,
                ...ellipseStart
            }
        ],
        subComponentStyles: {
            modalIconButton: {
                root: {
                    color: theme.semanticColors.menuIcon,
                    width: 'fit-content'
                }
            }
        }
    };
};
