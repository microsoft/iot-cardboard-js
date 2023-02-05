import { FontWeights, mergeStyleSets } from '@fluentui/react';
import {
    ITimeSeriesTableStyleProps,
    ITimeSeriesTableStyles
} from './TimeSeriesTable.types';

export const classPrefix = 'cb-time-series-table';
const classNames = {
    root: `${classPrefix}-root`,
    listWrapper: `${classPrefix}-list-wrapper`,
    notSetCell: `${classPrefix}-not-set-cell`
};
export const getStyles = (
    _props: ITimeSeriesTableStyleProps
): ITimeSeriesTableStyles => {
    return {
        root: [classNames.root],
        listWrapper: [
            classNames.listWrapper,
            { overflow: 'auto', position: 'relative', height: '100%' }
        ],
        notSetCell: [classNames.notSetCell, { fontStyle: 'italic' }],
        subComponentStyles: {
            detailsList: {
                root: { overflow: 'hidden', '.ms-DetailsRow': { fontSize: 13 } }
            },
            seriesColumn: (props) => {
                return mergeStyleSets({
                    root: {
                        color: props.color,
                        'span:first-child': {
                            fontWeight: FontWeights.semibold,
                            paddingRight: 4
                        }
                    }
                });
            }
        }
    };
};
