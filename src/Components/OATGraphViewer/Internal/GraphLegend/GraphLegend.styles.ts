import { FontSizes, FontWeights } from '@fluentui/react';
import {
    IGraphLegendStyleProps,
    IGraphLegendStyles
} from './GraphLegend.types';

const classPrefix = 'cb-graph-legend';
const classNames = {
    itemIcon: `${classPrefix}-item-icon`
};
export const getStyles = (
    props: IGraphLegendStyleProps
): IGraphLegendStyles => {
    const { theme } = props;
    return {
        itemIcon: [
            classNames.itemIcon,
            {
                width: 28
            }
        ],
        subComponentStyles: {
            rootStack: {
                root: {
                    position: 'relative',
                    background: theme.palette.neutralLight,
                    border: `1px solid ${theme.semanticColors.inputBorder}`,
                    fontSize: FontSizes.size12,
                    padding: 10,
                    zIndex: '100',
                    borderRadius: 5
                }
            },
            itemStack: {
                root: {
                    justifyContent: 'space-between'
                }
            },
            itemToggle: {
                label: {
                    fontSize: FontSizes.size12,
                    fontWeight: FontWeights.regular,
                    marginLeft: 8
                },
                root: {
                    margin: 0
                }
            }
        }
    };
};
