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
    _props: IGraphLegendStyleProps
): IGraphLegendStyles => {
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
                    fontSize: FontSizes.size12,
                    padding: 10,
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
