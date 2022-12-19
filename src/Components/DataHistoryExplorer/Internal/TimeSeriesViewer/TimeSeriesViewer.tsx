import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import {
    ITimeSeriesViewerProps,
    ITimeSeriesViewerStyleProps,
    ITimeSeriesViewerStyles
} from './TimeSeriesViewer.types';
import { getStyles } from './TimeSeriesViewer.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    Icon,
    IDropdownOption,
    ActionButton,
    Pivot,
    PivotItem,
    Stack,
    Dropdown
} from '@fluentui/react';
import { useTimeSeriesData } from '../../../../Models/Hooks/useTimeSeriesData';
import QuickTimesDropdown from '../../../QuickTimesDropdown/QuickTimesDropdown';
import HighChartsWrapper from '../../../HighChartsWrapper/HighChartsWrapper';
import { IHighChartSeriesData } from '../../../HighChartsWrapper/HighChartsWrapper.types';
import { useTranslation } from 'react-i18next';
import {
    getQuickTimeSpanKeyByValue,
    getYAxisTypeOptions,
    transformADXTimeSeriesToHighChartsSeries
} from '../../../../Models/SharedUtils/DataHistoryUtils';
import {
    AggregationTypeDropdownOptions,
    QuickTimeSpanKey,
    QuickTimeSpans
} from '../../../../Models/Constants';
import {
    IDataHistoryAggregationType,
    IDataHistoryChartOptions,
    IDataHistoryChartYAxisType
} from '../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { usePrevious } from '@fluentui/react-hooks';
import { DataHistoryExplorerContext } from '../../DataHistoryExplorer';
import produce from 'immer';
import GenericErrorImg from '../../../../Resources/Static/noResults.svg';
import IllustrationMessage from '../../../IllustrationMessage/IllustrationMessage';

enum ViewerPivot {
    Chart = 'Chart',
    Table = 'Table'
}

const getClassNames = classNamesFunction<
    ITimeSeriesViewerStyleProps,
    ITimeSeriesViewerStyles
>();

const TimeSeriesViewer: React.FC<ITimeSeriesViewerProps> = (props) => {
    const { timeSeriesTwinList, styles } = props;

    // state
    const [chartOptions, setChartOptions] = useState<IDataHistoryChartOptions>({
        yAxisType: 'independent',
        defaultQuickTimeSpanInMillis:
            QuickTimeSpans[QuickTimeSpanKey.Last15Mins],
        aggregationType: 'avg'
    });
    const [
        selectedQuickTimeSpanInMillis,
        setSelectedQuickTimeSpanInMillis
    ] = useState(chartOptions.defaultQuickTimeSpanInMillis);

    // hooks
    const { t } = useTranslation();
    const { adapter } = useContext(DataHistoryExplorerContext);
    const xMinDateInMillisRef = useRef<number>(null);
    const xMaxDateInMillisRef = useRef<number>(null);
    const {
        query,
        deeplink,
        data,
        fetchTimeSeriesData,
        isLoading
    } = useTimeSeriesData({
        adapter,
        connection: adapter.getADXConnectionInformation(),
        quickTimeSpanInMillis: selectedQuickTimeSpanInMillis,
        twins: timeSeriesTwinList
    });

    // callbacks
    const handleQuickTimesChange = useCallback((quickTimeInMillis: number) => {
        setSelectedQuickTimeSpanInMillis(quickTimeInMillis);
    }, []);
    const handleChartOptionChange = useCallback(
        (chartOption: 'aggregationType' | 'yAxisType', value: any) => {
            setChartOptions(
                produce((draft) => {
                    draft[chartOption as string] = value;
                })
            );
        },
        []
    );
    const handleOnRenderQuickTimeTitle = useCallback(
        (options: IDropdownOption[]): JSX.Element => {
            const option = options[0];
            const iconStyles = { marginRight: '8px' };

            return (
                <div style={{ display: 'flex' }}>
                    <Icon
                        style={iconStyles}
                        iconName="DateTime"
                        aria-hidden="true"
                    />
                    <span>{option.text}</span>
                </div>
            );
        },
        [t]
    );
    const handleOnRenderYAxisTypeTitle = useCallback(
        (options: IDropdownOption[]): JSX.Element => {
            const option = options[0];
            const iconStyles = { marginRight: '8px' };

            return (
                <div style={{ display: 'flex' }}>
                    <Icon
                        style={iconStyles}
                        iconName="StackedLineChart"
                        aria-hidden="true"
                    />
                    <span>{option.text}</span>
                </div>
            );
        },
        [t]
    );
    const handleOnRenderAggregationTypeTitle = useCallback(
        (options: IDropdownOption[]): JSX.Element => {
            const option = options[0];
            const iconStyles = { marginRight: '8px' };

            return (
                <div style={{ display: 'flex' }}>
                    <Icon
                        style={iconStyles}
                        iconName="AssessmentGroupTemplate"
                        aria-hidden="true"
                    />
                    <span>{option.text}</span>
                </div>
            );
        },
        [t]
    );
    const updateXMinAndMax = useCallback(() => {
        const nowInMillis = Date.now();
        xMinDateInMillisRef.current =
            nowInMillis - selectedQuickTimeSpanInMillis;
        xMaxDateInMillisRef.current = nowInMillis;
    }, [selectedQuickTimeSpanInMillis]);
    const highChartSeriesData: Array<IHighChartSeriesData> = useMemo(
        () =>
            timeSeriesTwinList.length
                ? transformADXTimeSeriesToHighChartsSeries(
                      data,
                      timeSeriesTwinList
                  )
                : [],
        [data, timeSeriesTwinList]
    );

    // side effects
    const prevQuery = usePrevious(query);
    useEffect(() => {
        if (query && query !== prevQuery) {
            fetchTimeSeriesData();
            updateXMinAndMax();
        }
    }, [query]);

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <div className={classNames.root}>
            <Pivot
                overflowBehavior={'menu'}
                styles={classNames.subComponentStyles.pivot}
            >
                <PivotItem
                    headerText={t('dataHistoryExplorer.viewer.chart')}
                    itemKey={ViewerPivot.Chart}
                >
                    {timeSeriesTwinList.length === 0 ? (
                        <IllustrationMessage
                            descriptionText={t(
                                'dataHistoryExplorer.viewer.noSeriesDescription'
                            )}
                            type={'info'}
                            width={'compact'}
                            imageProps={{
                                src: GenericErrorImg,
                                height: 172
                            }}
                            styles={{ container: { flexGrow: 1 } }}
                        />
                    ) : (
                        <>
                            <Stack
                                horizontal
                                tokens={{ childrenGap: 8 }}
                                className={classNames.commandWrapper}
                            >
                                <QuickTimesDropdown
                                    defaultSelectedKey={getQuickTimeSpanKeyByValue(
                                        selectedQuickTimeSpanInMillis
                                    )}
                                    onChange={(_env, option) =>
                                        handleQuickTimesChange(option.data)
                                    }
                                    onRenderTitle={handleOnRenderQuickTimeTitle}
                                    hasLabel={false}
                                />
                                <Dropdown
                                    styles={{ root: { width: 88 } }}
                                    className={classNames.command}
                                    selectedKey={chartOptions.aggregationType}
                                    onChange={(_env, option) =>
                                        handleChartOptionChange(
                                            'aggregationType',
                                            option.key as IDataHistoryAggregationType
                                        )
                                    }
                                    options={AggregationTypeDropdownOptions}
                                    onRenderTitle={
                                        handleOnRenderAggregationTypeTitle
                                    }
                                />
                                <Dropdown
                                    styles={{ root: { width: 140 } }}
                                    className={classNames.command}
                                    selectedKey={chartOptions.yAxisType}
                                    onChange={(_env, option) =>
                                        handleChartOptionChange(
                                            'yAxisType',
                                            option.key as IDataHistoryChartYAxisType
                                        )
                                    }
                                    options={getYAxisTypeOptions(t)}
                                    onRenderTitle={handleOnRenderYAxisTypeTitle}
                                />
                            </Stack>
                            <HighChartsWrapper
                                styles={
                                    classNames.subComponentStyles.chartWrapper
                                }
                                seriesData={highChartSeriesData}
                                isLoading={isLoading}
                                chartOptions={{
                                    titleAlign: 'left',
                                    legendLayout: 'vertical',
                                    legendPadding: 0,
                                    hasMultipleAxes:
                                        chartOptions.yAxisType ===
                                        'independent',
                                    dataGrouping: chartOptions.aggregationType,
                                    xMinInMillis: xMinDateInMillisRef.current,
                                    xMaxInMillis: xMaxDateInMillisRef.current
                                }}
                            />
                            <ActionButton
                                iconProps={{ iconName: 'OpenInNewWindow' }}
                                onClick={() => {
                                    window.open(deeplink, '_blank');
                                }}
                            >
                                {t('widgets.dataHistory.openQuery')}
                            </ActionButton>
                        </>
                    )}
                </PivotItem>
                <PivotItem
                    headerText={t('dataHistoryExplorer.viewer.table')}
                    itemKey={ViewerPivot.Table}
                >
                    <>TBD</>
                </PivotItem>
            </Pivot>
        </div>
    );
};

export default styled<
    ITimeSeriesViewerProps,
    ITimeSeriesViewerStyleProps,
    ITimeSeriesViewerStyles
>(TimeSeriesViewer, getStyles);
