import {
    classNamesFunction,
    DirectionalHint,
    Icon,
    IDropdownOption,
    styled,
    useTheme
} from '@fluentui/react';
import React, {
    memo,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { useTranslation } from 'react-i18next';
import {
    ADXTimeSeries,
    BehaviorModalMode,
    DTwin,
    IDataHistoryWidgetTimeSeriesTwin,
    TimeSeriesData
} from '../../../../../Models/Constants';
import { useTimeSeriesData } from '../../../../../Models/Hooks/useTimeSeriesData';
import {
    getMockTimeSeriesDataArrayInLocalTime,
    getQuickTimeSpanKeyByValue
} from '../../../../../Models/Services/Utils';
import {
    IDataHistoryTimeSeries,
    IDataHistoryWidgetConfiguration
} from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import HighChartsWrapper from '../../../../HighChartsWrapper/HighChartsWrapper';
import { IHighChartSeriesData } from '../../../../HighChartsWrapper/HighChartsWrapper.types';
import {
    IOverflowMenuProps,
    OverflowMenu
} from '../../../../OverflowMenu/OverflowMenu';
import QuickTimesDropdown from '../../../../QuickTimesDropdown/QuickTimesDropdown';
import { BehaviorsModalContext } from '../../../BehaviorsModal';
import { getStyles } from './DataHistoryWidget.styles';
import {
    IDataHistoryWidgetProps,
    IDataHistoryWidgetStyleProps,
    IDataHistoryWidgetStyles
} from './DataHistoryWidget.types';

const getClassNames = classNamesFunction<
    IDataHistoryWidgetStyleProps,
    IDataHistoryWidgetStyles
>();

const DataHistoryWidget: React.FC<IDataHistoryWidgetProps> = ({
    widget,
    styles
}) => {
    const {
        displayName,
        connectionString,
        timeSeries,
        chartOptions
    } = widget.widgetConfiguration;

    const { adapter, twins, mode } = useContext(BehaviorsModalContext);
    const twinIdPropertyMap = getTwinIdPropertyMap(timeSeries, twins);
    const [
        selectedQuickTimeSpanInMillis,
        setSelectedQuickTimeSpanInMillis
    ] = useState(chartOptions.defaultQuickTimeSpanInMillis);
    const isRequestSent = useRef(false);

    const {
        query,
        deeplink,
        data,
        fetchTimeSeriesData,
        isLoading
    } = useTimeSeriesData({
        adapter,
        connectionString,
        quickTimeSpanInMillis: selectedQuickTimeSpanInMillis,
        twins: twinIdPropertyMap
    });

    const { t } = useTranslation();

    const xMinDateInMillisRef = useRef<number>(null);
    const xMaxDateInMillisRef = useRef<number>(null);

    const updateXMinAndMax = useCallback(() => {
        const nowInMillis = Date.now();
        xMinDateInMillisRef.current =
            nowInMillis - selectedQuickTimeSpanInMillis;
        xMaxDateInMillisRef.current = nowInMillis;
    }, [selectedQuickTimeSpanInMillis]);

    useEffect(() => {
        if (
            mode === BehaviorModalMode.viewer &&
            query &&
            (adapter || connectionString) &&
            !isRequestSent.current &&
            twinIdPropertyMap
        ) {
            fetchTimeSeriesData();
            updateXMinAndMax();
            isRequestSent.current = true;
        }
    }, [adapter, query, connectionString, twinIdPropertyMap, mode]);

    const placeholderTimeSeriesData: Array<
        Array<TimeSeriesData>
    > = useMemo(
        () =>
            getMockTimeSeriesDataArrayInLocalTime(
                timeSeries.length,
                5,
                chartOptions.defaultQuickTimeSpanInMillis
            ),
        [chartOptions.defaultQuickTimeSpanInMillis, timeSeries.length]
    );

    const highChartSeriesData: Array<IHighChartSeriesData> = useMemo(
        () =>
            mode === BehaviorModalMode.preview
                ? generatePlaceholderHighChartsData(
                      widget.widgetConfiguration,
                      placeholderTimeSeriesData
                  )
                : transformADXTimeSeriesToHighChartsSeries(
                      data,
                      twinIdPropertyMap
                  ),
        [mode, widget.widgetConfiguration, data, twinIdPropertyMap]
    );

    const classNames = getClassNames(styles, { theme: useTheme() });

    const onRenderTitleOfQuickTimePickerItem = (
        options: IDropdownOption[]
    ): JSX.Element => {
        const option = options[0];
        return (
            option.data && (
                <Icon
                    style={
                        classNames.subComponentStyles?.quickTimePicker?.()
                            .menuTtemIcon
                    }
                    iconName="DateTime"
                    aria-hidden="true"
                />
            )
        );
    };

    const onRenderCaretDown = (): JSX.Element => {
        return;
    };

    const renderQuickTimePickerItem = (): React.ReactNode => {
        return (
            <QuickTimesDropdown
                styles={{
                    root: classNames.subComponentStyles?.quickTimePicker?.()
                        .dropdown
                }}
                hasLabel={false}
                defaultSelectedKey={getQuickTimeSpanKeyByValue(
                    selectedQuickTimeSpanInMillis
                )}
                onChange={(_env, option) => {
                    isRequestSent.current = false;
                    setSelectedQuickTimeSpanInMillis(option.data);
                }}
                onRenderTitle={onRenderTitleOfQuickTimePickerItem}
                onRenderCaretDown={onRenderCaretDown}
                calloutProps={{
                    calloutWidth: classNames.subComponentStyles?.quickTimePicker?.()
                        .calloutWidth
                }}
            />
        );
    };

    const menuProps: IOverflowMenuProps = {
        ariaLabel: t('widgets.dataHistory.headerMenu'),
        index: 0,
        menuKey: `${widget.id}-overflow-menu`,
        menuProps: {
            directionalHint: DirectionalHint.bottomRightEdge,
            items: [
                {
                    key: 'open-link',
                    text: t('widgets.dataHistory.openQuery'),
                    onClick: () => {
                        window.open(deeplink, '_blank');
                    },
                    iconProps: { iconName: 'OpenInNewWindow' },
                    className: classNames.menuItem
                }
            ],
            className: classNames.menu
        },
        className: classNames.menuButton
    };

    return (
        <div className={classNames.root}>
            <div className={classNames.header}>
                <span className={classNames.title}>{displayName}</span>
                {mode === BehaviorModalMode.viewer && (
                    <>
                        {renderQuickTimePickerItem()}
                        <OverflowMenu {...menuProps} />
                    </>
                )}
            </div>

            <div className={classNames.chartContainer}>
                <HighChartsWrapper
                    seriesData={highChartSeriesData}
                    isLoading={isLoading}
                    chartOptions={{
                        titleAlign: 'left',
                        legendLayout: 'vertical',
                        legendPadding: 0,
                        hasMultipleAxes:
                            chartOptions.yAxisType === 'independent',
                        dataGrouping: chartOptions.aggregationType,
                        xMinInMillis: xMinDateInMillisRef.current,
                        xMaxInMillis: xMaxDateInMillisRef.current
                    }}
                />
            </div>
        </div>
    );
};

/** Gets timeSeries list from data history widget and twins and
 * evaluate the twin id and property name tuples using the resolved twins to use in query
 */
const getTwinIdPropertyMap = (
    timeSeries: IDataHistoryTimeSeries,
    twins: Record<string, DTwin>
): Array<IDataHistoryWidgetTimeSeriesTwin> =>
    twins
        ? timeSeries.map((ts) => {
              const splittedArray = ts.expression?.split('.'); // expression is in [PrimaryTwin.Temperature] or [PrimaryTwin.Status.Temperature] nested propery format
              if (splittedArray) {
                  const [alias, ...propertyPath] = splittedArray;
                  if (twins && alias?.length && propertyPath?.length) {
                      return {
                          label: ts.label,
                          twinId: twins[alias]?.$dtId,
                          twinPropertyName: propertyPath.join('.')
                      };
                  }
              }
          })
        : null;

/** Gets fetched adx time series data and data history widget time series to twin mapping information
 * to get the labels if defined for each series, and converts it into high chart series data to render in chart
 */
const transformADXTimeSeriesToHighChartsSeries = (
    adxTimeSeries: Array<ADXTimeSeries>,
    twinIdPropertyMap: Array<IDataHistoryWidgetTimeSeriesTwin>
): Array<IHighChartSeriesData> =>
    adxTimeSeries && twinIdPropertyMap
        ? adxTimeSeries.map(
              (series) =>
                  ({
                      name:
                          twinIdPropertyMap.find(
                              (map) =>
                                  map.twinId === series.id &&
                                  map.twinPropertyName === series.key
                          )?.label || series.id + ' ' + series.key, // this is the label for series to show in chart
                      data: series.data
                  } as IHighChartSeriesData)
          )
        : [];

/** Generate placeholder mock data for timeseries to show in chart in preview mode
 */
const generatePlaceholderHighChartsData = (
    widgetConfig: IDataHistoryWidgetConfiguration,
    placeholderTimeSeriesData: Array<Array<TimeSeriesData>>
): Array<IHighChartSeriesData> => {
    return widgetConfig.timeSeries.map((ts, idx) => ({
        name: `${ts.label || ts.expression}`,
        data: placeholderTimeSeriesData[idx],
        tooltipSuffix: ts.unit
    }));
};

export default styled<
    IDataHistoryWidgetProps,
    IDataHistoryWidgetStyleProps,
    IDataHistoryWidgetStyles
>(memo(DataHistoryWidget), getStyles);
