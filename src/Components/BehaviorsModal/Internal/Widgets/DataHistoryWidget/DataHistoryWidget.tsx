import {
    classNamesFunction,
    DirectionalHint,
    Icon,
    IDropdownOption,
    styled,
    useTheme
} from '@fluentui/react';
import { usePrevious } from '@fluentui/react-hooks';
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
    IADXConnection,
    IDataHistoryTimeSeriesTwin,
    TimeSeriesData
} from '../../../../../Models/Constants';
import { useTimeSeriesData } from '../../../../../Models/Hooks/useTimeSeriesData';
import { getMockTimeSeriesDataArrayInLocalTime } from '../../../../../Models/Services/Utils';
import { getQuickTimeSpanKeyByValue } from '../../../../../Models/SharedUtils/DataHistoryUtils';
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
import { DataHistoryWidgetErrorHandling } from './Internal/DataHistoryWidgetErrorHandling';

export const getDataHistoryWidgetClassNames = classNamesFunction<
    IDataHistoryWidgetStyleProps,
    IDataHistoryWidgetStyles
>();

const DataHistoryWidget: React.FC<IDataHistoryWidgetProps> = ({
    widget,
    styles
}) => {
    const {
        displayName,
        connection,
        timeSeries,
        chartOptions
    } = widget.widgetConfiguration;

    const { adapter, twins, mode } = useContext(BehaviorsModalContext);
    const twinIdPropertyMap = getTwinIdPropertyMap(timeSeries, twins);
    const [
        selectedQuickTimeSpanInMillis,
        setSelectedQuickTimeSpanInMillis
    ] = useState(chartOptions.defaultQuickTimeSpanInMillis);

    const connectionToQuery: IADXConnection = useMemo(
        () =>
            connection
                ? {
                      kustoClusterUrl: connection.adxClusterUrl,
                      kustoDatabaseName: connection.adxDatabaseName,
                      kustoTableName: connection.adxTableName
                  }
                : null,
        [connection]
    );
    const {
        query,
        deeplink,
        data,
        errors,
        fetchTimeSeriesData,
        isLoading
    } = useTimeSeriesData({
        adapter,
        connection: connectionToQuery,
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

    const prevQuery = usePrevious(query);
    useEffect(() => {
        if (mode === BehaviorModalMode.viewer && query !== prevQuery) {
            fetchTimeSeriesData();
            updateXMinAndMax();
        }
    }, [query, mode]);

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

    const classNames = getDataHistoryWidgetClassNames(styles, {
        theme: useTheme()
    });

    const onRenderTitleOfQuickTimePickerItem = (
        options: IDropdownOption[]
    ): JSX.Element => {
        const option = options[0];
        return (
            option.data && (
                <Icon
                    style={
                        classNames.subComponentStyles?.quickTimePicker?.()
                            .menuItemIcon
                    }
                    iconName="DateTime"
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
                    setSelectedQuickTimeSpanInMillis(option.data);
                }}
                onRenderTitle={onRenderTitleOfQuickTimePickerItem}
                onRenderCaretDown={onRenderCaretDown}
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
            {errors.length > 0 ? (
                <>
                    <div className={classNames.header}>
                        <span className={classNames.title}>{displayName}</span>
                    </div>
                    <DataHistoryWidgetErrorHandling errors={errors} />
                </>
            ) : (
                <>
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
                </>
            )}
        </div>
    );
};

/** Gets timeSeries list from data history widget and twins and
 * evaluate the twin id and property name tuples using the resolved twins to use in query
 */
const getTwinIdPropertyMap = (
    timeSeries: IDataHistoryTimeSeries,
    twins: Record<string, DTwin>
): Array<IDataHistoryTimeSeriesTwin> =>
    twins
        ? timeSeries.map((ts) => {
              const splittedArray = ts.expression?.split('.'); // expression is in [PrimaryTwin.Temperature] or [PrimaryTwin.Status.Temperature] nested propery format
              if (splittedArray) {
                  const [alias, ...propertyPath] = splittedArray;
                  if (twins && alias?.length && propertyPath?.length) {
                      return {
                          label: ts.label,
                          twinId: twins[alias]?.$dtId,
                          twinPropertyName: propertyPath.join('.'),
                          twinPropertyType: ts.propertyType
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
    twinIdPropertyMap: Array<IDataHistoryTimeSeriesTwin>
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
