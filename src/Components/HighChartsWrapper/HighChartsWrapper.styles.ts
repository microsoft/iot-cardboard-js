import { FontWeights } from '@fluentui/react';
import { CSSObject } from 'highcharts';
import {
    IHighChartsWrapperStyleProps,
    IHighChartsWrapperStyles
} from './HighChartsWrapper.types';

export const classPrefix = 'cb-highcharts-wrapper';
const classNames = {
    root: `${classPrefix}-root`,
    shareButton: `${classPrefix}-share-button`
};
export const getStyles = ({
    theme
}: IHighChartsWrapperStyleProps): IHighChartsWrapperStyles => {
    const commonTextStyling: Partial<CSSObject> = {
        color: theme.palette.black
    };
    const commonChartTextStyling: Partial<CSSObject> = {
        ...commonTextStyling,
        fontSize: '12px',
        fontWeight: 'normal'
    };
    return {
        root: [
            classNames.root,
            {
                width: '100%',
                height: '100%'
            }
        ],
        subComponentStyles: {
            title: {
                root: {
                    color: theme.palette.black,
                    fontSize: '12px',
                    lineHeight: '12px',
                    zIndex: 0
                }
            },
            xAxis: {
                title: commonTextStyling,
                label: commonTextStyling
            },
            yAxis: {
                title: commonTextStyling,
                label: commonTextStyling
            },
            legend: {
                root: commonChartTextStyling,
                hover: {
                    fontWeight: FontWeights.bold as string,
                    color: '#cccccc'
                }
            },
            loadingText: {
                root: {
                    ...commonChartTextStyling,
                    color: theme.palette.themePrimary
                }
            },
            noDataText: {
                root: {
                    ...commonChartTextStyling,
                    color: theme.palette.neutralSecondary
                }
            }
        }
    };
};
