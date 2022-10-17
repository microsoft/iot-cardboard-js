import React, { useEffect, useMemo, useRef } from 'react';
import {
    IHighChartsWrapperProps,
    IHighChartsWrapperStyleProps,
    IHighChartsWrapperStyles,
    MAX_NUMBER_OF_SERIES_IN_HIGH_CHARTS
} from './HighChartsWrapper.types';
import { getStyles } from './HighChartsWrapper.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    IconButton
} from '@fluentui/react';
import Highcharts, {
    ColorString,
    CSSObject,
    DataGroupingApproximationValue,
    OptionsLayoutValue,
    SeriesOptionsType
} from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useTranslation } from 'react-i18next';
import { renderToString } from 'react-dom/server';
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
                                enabled: false // by default, do not mark data points on series, only on hover
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
            style: classNames.subComponentStyles.yAxis().label as CSSObject
        }
    };

    const multipleYAxisProps: Array<Highcharts.YAxisOptions> = highChartSeries.map(
        (_hcS, idx) => {
            const isOnOppositeSide =
                idx >= Math.floor(highChartSeries.length / 2) ? true : false; // by default, put the other half of the y-axes to the opposite side
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

    const deeplinkShareButtonDOMString = renderToString(
        <IconButton
            iconProps={{ iconName: 'Share' }}
            title={t('highcharts.shareQuery')}
            ariaLabel={t('highcharts.shareQuery')}
            className={classNames.shareButton}
        />
    );

    const options: Highcharts.Options = {
        accessibility: { enabled: true },
        title: {
            useHTML: chartOptions?.titleTargetLink ? true : false,
            text:
                chartOptions?.titleTargetLink && title
                    ? `<div style="display: flex; align-items: center">
                    <span> ${title} </span> 
                    <a style="color:inherit" target="_blank" href="${chartOptions?.titleTargetLink}">
                    ${deeplinkShareButtonDOMString}
                    </a></div>` // need to hardcode styling here
                    : title || t('highcharts.noTitle'),
            style: classNames.subComponentStyles.title().root as CSSObject
        },
        series: highChartSeries,
        xAxis: {
            type: 'datetime',
            title: {
                style: classNames.subComponentStyles.xAxis().title as CSSObject
            },
            labels: {
                style: classNames.subComponentStyles.xAxis().label as CSSObject
            }
        },
        yAxis: chartOptions?.hasMultipleAxes
            ? multipleYAxisProps
            : defaultYAxisProps,
        chart: {
            ...(classNames.subComponentStyles.chart().root as CSSObject),
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
            itemHoverStyle: classNames.subComponentStyles.legend()
                .hover as CSSObject,
            itemStyle: classNames.subComponentStyles.legend().root as CSSObject
        },
        lang: {
            noData: t('highcharts.noData'),
            loading: t('loading')
        },
        tooltip: {
            shared: true
        },
        loading: {
            hideDuration: 1000,
            style: {
                background: 'transparent'
            },
            labelStyle: classNames.subComponentStyles.loadingText()
                .root as CSSObject
        },
        noData: isLoading
            ? null
            : {
                  style: classNames.subComponentStyles.noDataText()
                      .root as CSSObject
              },
        plotOptions: {
            series: {
                dataGrouping: {
                    enabled: true // by default, notice that it is not forced considering we may want to see raw data when possible
                }
            }
        }
    };

    return (
        <div className={classNames.container}>
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
