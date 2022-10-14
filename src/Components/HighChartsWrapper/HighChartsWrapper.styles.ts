import { IStyle } from '@fluentui/react';
import {
    IHighChartsWrapperStyleProps,
    IHighChartsWrapperStyles
} from './HighChartsWrapper.types';

export const classPrefix = 'cb-highcharts-wrapper';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = ({
    theme
}: IHighChartsWrapperStyleProps): IHighChartsWrapperStyles => {
    const commonTextStyling: Partial<IStyle> = { color: theme.palette.black };
    return {
        root: [
            classNames.root,
            {
                width: '100%',
                height: '100%',
                '.highcharts-credits': { display: 'none' }
            }
        ],
        subComponentStyles: {
            chart: {
                root: {
                    backgroundColor: 'var(--cb-color-glassy-modal)'
                }
            },
            title: {
                root: {
                    color: theme.palette.themePrimary
                }
            },
            xAxis: {
                title: {
                    ...commonTextStyling
                },
                label: {
                    ...commonTextStyling
                }
            },
            yAxis: {
                title: {
                    ...commonTextStyling
                },
                label: {
                    ...commonTextStyling
                }
            },
            legend: {
                root: {
                    fontWeight: 'normal'
                }
            }
        }
    };
};
