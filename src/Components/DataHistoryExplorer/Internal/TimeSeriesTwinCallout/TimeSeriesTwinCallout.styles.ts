import {
    ITimeSeriesTwinCalloutStyleProps,
    ITimeSeriesTwinCalloutStyles
} from './TimeSeriesTwinCallout.types';

export const classPrefix = 'cb-time-series-twin-callout';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    _props: ITimeSeriesTwinCalloutStyleProps
): ITimeSeriesTwinCalloutStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {
            callout: { calloutMain: { padding: 12 } },
            typeCastToggle: {
                root: {
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    margin: '4px 0 0 0'
                },
                label: {
                    fontWeight: 'normal'
                }
            }
        }
    };
};
