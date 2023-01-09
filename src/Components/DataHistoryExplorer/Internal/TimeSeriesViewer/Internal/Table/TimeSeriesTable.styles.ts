import {
    ITimeSeriesTableStyleProps,
    ITimeSeriesTableStyles
} from './TimeSeriesTable.types';

export const classPrefix = 'cb-time-series-table';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    _props: ITimeSeriesTableStyleProps
): ITimeSeriesTableStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {
            detailsList: {
                root: {
                    overflowY: 'auto',
                    overflowX: 'hidden'
                }
            },
            seriesDropdown: {
                root: {
                    width: 280
                }
            }
        }
    };
};
