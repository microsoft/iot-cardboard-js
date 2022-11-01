import { FontSizes } from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../Models/Constants';
import { getControlBackgroundColor } from '../../Models/Constants/OatStyleConstants';
import {
    IOATModelListStyleProps,
    IOATModelListStyles
} from './OATModelList.types';

const classPrefix = `${CardboardClassNamePrefix}-oat-model-list`;
const classNames = {
    root: `${classPrefix}-root`,
    listContainer: `${classPrefix}-container`,
    noDataMessage: `${classPrefix}-no-data`
};
export const getStyles = (
    props: IOATModelListStyleProps
): IOATModelListStyles => {
    const { theme } = props;
    return {
        root: [classNames.root],
        listContainer: [
            classNames.listContainer,
            {
                // backgroundColor: theme.semanticColors.bodyBackground,
                width: '100%',
                height: 'calc(100% - 32px)', // less the search box
                overflowX: 'hidden',
                overflowY: 'auto'
            }
        ],
        noDataMessage: [
            classNames.noDataMessage,
            {
                fontSize: FontSizes.size12,
                color: theme.palette.neutralSecondary
            }
        ],
        subComponentStyles: {
            listItem: (_props?: { isSelected: boolean }) => ({
                root: {
                    backgroundColor: 'transparent'
                },
                rootCheckedHovered: {
                    backgroundColor: theme.palette.neutralLighter
                }
            }),
            rootStack: {
                root: {
                    height: '100%',
                    overflow: 'hidden'
                }
            },
            searchbox: {
                root: {
                    backgroundColor: getControlBackgroundColor(theme)
                }
            }
        }
    };
};
