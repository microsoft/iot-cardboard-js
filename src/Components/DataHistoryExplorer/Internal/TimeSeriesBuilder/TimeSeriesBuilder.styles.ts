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
    twinPropertyList: `${classPrefix}-twin-property-list`,
    addNewButton: `${classPrefix}-add-new`
};
export const getStyles = (
    props: ITimeSeriesBuilderStyleProps
): ITimeSeriesBuilderStyles => {
    return {
        root: [
            classNames.root,
            {
                borderRight: `1px solid ${props.theme.palette.neutralLight}`,
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }
        ],
        header: [
            classNames.header,
            {
                fontWeight: FontWeights.semibold,
                fontSize: FontSizes.size16,
                marginTop: '0 !important'
            }
        ],
        description: [
            classNames.description,
            {
                color: props.theme.palette.neutralSecondary,
                fontSize: FontSizes.medium,
                marginTop: '0 !important'
            }
        ],
        twinPropertyList: [classNames.twinPropertyList, { flexGrow: 1 }],
        addNewButton: [classNames.addNewButton, { padding: '8px 0px' }],
        subComponentStyles: {
            timeSeriesTwinCallout: {
                subComponentStyles: {
                    callout: { calloutMain: { width: 300 } }
                }
            }
        }
    };
};
