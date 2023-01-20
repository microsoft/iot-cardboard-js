import { mergeStyleSets } from '@fluentui/react';
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
        root: [
            classNames.root,
            {
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }
        ],
        listWrapper: [
            classNames.listWrapper,
            { overflow: 'auto', position: 'relative', flexGrow: 1 }
        ],
        notSetCell: [classNames.notSetCell, { fontStyle: 'italic' }],
        subComponentStyles: {
            loadingSpinner: { root: { height: '100%' } },
            colorCellStyles: {
                pillStyles: (props) => {
                    return mergeStyleSets({
                        root: {
                            width: 24,
                            height: 24,
                            backgroundColor: props.color,
                            borderRadius: '50%'
                        }
                    });
                }
            }
        }
    };
};
