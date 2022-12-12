import { FontSizes, FontWeights } from '@fluentui/react';
import {
    ITimeSeriesBuilderStyleProps,
    ITimeSeriesBuilderStyles
} from './TimeSeriesBuilder.types';

export const classPrefix = 'cb-time-series-builder';
const classNames = {
    root: `${classPrefix}-root`,
    header: `${classPrefix}-header`,
    description: `${classPrefix}-description`,
    twinPropertyList: `${classPrefix}-twin-property-list`
};
export const getStyles = (
    props: ITimeSeriesBuilderStyleProps
): ITimeSeriesBuilderStyles => {
    return {
        root: [
            classNames.root,
            {
                borderRight: `1px solid ${props.theme.palette.neutralLight}`
            }
        ],
        header: [
            classNames.header,
            { fontWeight: FontWeights.bold, fontSize: FontSizes.size14 }
        ],
        description: [
            classNames.description,
            {
                color: props.theme.palette.neutralSecondary,
                fontSize: FontSizes.medium
            }
        ],
        twinPropertyList: [classNames.twinPropertyList, { flexGrow: 1 }],
        subComponentStyles: {
            timeSeriesTwinCallout: {
                subComponentStyles: {
                    callout: { calloutMain: { width: 300 } }
                }
            }
        }
    };
};
