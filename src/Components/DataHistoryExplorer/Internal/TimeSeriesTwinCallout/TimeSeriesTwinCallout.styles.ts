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
        subComponentStyles: { callout: { calloutMain: { padding: 12 } } }
    };
};
