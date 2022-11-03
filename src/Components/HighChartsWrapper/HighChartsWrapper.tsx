import React, { useEffect, useMemo, useRef } from 'react';
import {
    IHighChartsWrapperProps,
    IHighChartsWrapperStyleProps,
    IHighChartsWrapperStyles,
    MAX_NUMBER_OF_SERIES_IN_HIGH_CHARTS
} from './HighChartsWrapper.types';
import { getStyles } from './HighChartsWrapper.styles';
import { classNamesFunction, useTheme, styled } from '@fluentui/react';
import {
    AlignValue,
    ColorString,
    DataGroupingApproximationValue,
    OptionsLayoutValue,
    SeriesOptionsType
} from 'highcharts';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { useTranslation } from 'react-i18next';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import { deepCopy } from '../../Models/Services/Utils';
import { IDataHistoryAggregationType } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
NoDataToDisplay(Highcharts);
require('highcharts/modules/accessibility')(Highcharts);

const getClassNames = classNamesFunction<
    IHighChartsWrapperStyleProps,
    IHighChartsWrapperStyles
>();

const HighChartsWrapper: React.FC<IHighChartsWrapperProps> = (props) => {
    const { title, seriesData, isLoading = false, styles } = props;
    const chartOptions = {
        titleAlign: 'center' as AlignValue,
        legendLayout: 'horizontal' as OptionsLayoutValue,
        hasMultipleAxes: false,
        dataGrouping: 'avg' as IDataHistoryAggregationType,
        ...props.chartOptions
    };

    // hooks
    const { t } = useTranslation();
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

    // callbacks
    const highChartColor = (idx: number): ColorString =>
        idx === 1 // that particular color of Highcharts is not visible in our dark themes, override it
            ? '#d781fc'
            : (Highcharts.getOptions().colors[idx] as ColorString);

    const highChartSeries: Array<SeriesOptionsType> = useMemo(
        () =>
            deepCopy(seriesData)
                ?.splice(0, MAX_NUMBER_OF_SERIES_IN_HIGH_CHARTS)
                ?.map(
                    (sD, idx) =>
                        ({
                            name: sD.name,
                            data: sD.data
                                .map((d) => [
                                    typeof d.timestamp === 'string'
                                        ? new Date(d.timestamp).getTime()
                                        : d.timestamp, // by default, if timestamp is date string convert it to number since highcharts only accept number type for series
                                    Math.round(d.value * 100) / 100 // by default, fix rounding 2 decimal after point
                                ])
                                .sort((a, b) => a[0] - b[0]), // sort in case the timestamps are not in ascending order
                            type: 'line', // by default, show series in line chart type
                            color: highChartColor(idx), // by default, set color to use it for labels in legend to match series color
                            marker: {
                                enabled: sD.data.length === 1 // by default, do not mark data points if there is more than 1, only show on hover
                            },
                            tooltip: {
                                ...(sD.tooltipSuffix && {
                                    // by default, append tooltip suffix if exist for series (e.g. unit and/or aggregation of series data)
                                    valueSuffix: ` ${sD.tooltipSuffix}`
                                })
                            },
                            yAxis: chartOptions?.hasMultipleAxes
                                ? idx
                                : undefined,
                            dataGrouping: {
                                approximation: (chartOptions.dataGrouping ===
                                'min'
                                    ? 'low'
                                    : chartOptions.dataGrouping === 'max'
                                    ? 'high'
                                    : 'average') as DataGroupingApproximationValue
                            }
                        } as SeriesOptionsType)
                ) || [],
        [seriesData]
    );

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    //side-effects
    useEffect(() => {
        if (!isLoading) {
            chartComponentRef.current?.chart?.hideLoading();
        }
    }, [isLoading]);

    const defaultYAxisProps: Highcharts.YAxisOptions = {
        title: undefined, // by default, do not show any labels in y axis, only numeric range
        labels: {
            style: classNames.subComponentStyles.yAxis().label
        }
    };

    const multipleYAxisProps: Array<Highcharts.YAxisOptions> = highChartSeries.map(
        (_hcS, idx) => {
            const isOnOppositeSide =
                idx > 0 && idx >= Math.floor(highChartSeries.length / 2)
                    ? true
                    : false; // by default, put the other half of the y-axes to the opposite side
            return {
                gridLineWidth: idx > 1 ? 0 : 1,
                opposite: isOnOppositeSide,
                title: undefined, // by default, do not show any labels in y axis, only numeric range
                labels: {
                    x: isOnOppositeSide ? 8 : -8, // to make label space less to make up more space for plot
                    style: { color: highChartColor(idx) }
                }
            };
        }
    );

    const xAxisStyles = classNames.subComponentStyles.xAxis();
    const legendStyles = classNames.subComponentStyles.legend();
    const tooltipStyles = classNames.subComponentStyles.tooltip();
    const options: Highcharts.Options = {
        credits: { enabled: false },
        rangeSelector: { enabled: false },
        time: {
            useUTC: false // by default, date is in local time
        },
        accessibility: { enabled: true },
        title: {
            align: chartOptions.titleAlign,
            text: title,
            style: classNames.subComponentStyles.title().root
        },
        series: highChartSeries,
        xAxis: {
            type: 'datetime',
            title: {
                style: xAxisStyles.title
            },
            labels: {
                style: xAxisStyles.label
            },
            showFirstLabel: true,
            showLastLabel: true,
            min: chartOptions.xMinInMillis,
            max: chartOptions.xMaxInMillis
        },
        yAxis: chartOptions?.hasMultipleAxes
            ? multipleYAxisProps
            : defaultYAxisProps,
        chart: {
            backgroundColor: 'transparent',
            ...classNames.subComponentStyles.chart?.().root,
            events: {
                load() {
                    this.showLoading();
                }
            }
        },
        legend: {
            layout: chartOptions?.legendLayout,
            labelFormatter: function () {
                if (!this.visible) {
                    return '<span>' + this.name + '</span>';
                } else {
                    return (
                        '<span style="color: ' +
                        this.options.color +
                        '">' +
                        this.name +
                        '</span>'
                    );
                }
            },
            ...(chartOptions?.legendPadding && {
                padding: chartOptions?.legendPadding
            }),
            margin: 0,
            y: 12,
            itemHoverStyle: legendStyles.hover,
            itemStyle: legendStyles.root
        },
        lang: {
            noData: t('highcharts.noDataDescription'),
            loading: t('loading')
        },
        tooltip: {
            shared: true,
            useHTML: true,
            style: tooltipStyles?.root,
            valueDecimals: 2,
            xDateFormat: '%A, %b %e, %Y %H:%M:%S %p'
        },
        loading: {
            hideDuration: 1000,
            style: {
                background: 'transparent'
            },
            labelStyle: classNames.subComponentStyles.loadingText().root
        },
        noData: isLoading
            ? null
            : {
                  style: classNames.subComponentStyles.noDataText().root
              },
        plotOptions: {
            series: {
                dataGrouping: {
                    enabled: true, // by default, notice that it is not forced considering we may want to see raw data when possible
                    anchor: 'middle',
                    groupPixelWidth: 4
                }
            }
        }
    };

    return (
        <div className={classNames.root}>
            <HighchartsReact
                ref={chartComponentRef}
                highcharts={Highcharts}
                options={options}
                containerProps={{ style: { width: '100%', height: '100%' } }}
            />
        </div>
    );
};

export default styled<
    IHighChartsWrapperProps,
    IHighChartsWrapperStyleProps,
    IHighChartsWrapperStyles
>(HighChartsWrapper, getStyles);
