import React, {
    useCallback,
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
    Stack
} from '@fluentui/react';
import { useTimeSeriesData } from '../../../../Models/Hooks/useTimeSeriesData';
import QuickTimesDropdown, {
    getQuickTimeSpanKeyByValue
} from '../../../QuickTimesDropdown/QuickTimesDropdown';
import HighChartsWrapper from '../../../HighChartsWrapper/HighChartsWrapper';
import { IHighChartSeriesData } from '../../../HighChartsWrapper/HighChartsWrapper.types';
import { useTranslation } from 'react-i18next';
import { transformADXTimeSeriesToHighChartsSeries } from '../../../../Models/SharedUtils/DataHistoryUtils';
import { QuickTimeSpanKey, QuickTimeSpans } from '../../../../Models/Constants';
import { IDataHistoryChartOptions } from '../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { usePrevious } from '@fluentui/react-hooks';

const chartOptions: IDataHistoryChartOptions = {
    yAxisType: 'independent',
    defaultQuickTimeSpanInMillis: QuickTimeSpans[QuickTimeSpanKey.Last15Mins],
    aggregationType: 'avg'
};

enum ViewerPivot {
    Chart = 'Chart',
    Table = 'Table'
}

const getClassNames = classNamesFunction<
    ITimeSeriesViewerStyleProps,
    ITimeSeriesViewerStyles
>();

const TimeSeriesViewer: React.FC<ITimeSeriesViewerProps> = (props) => {
    const { adapter, timeSeriesTwinList, styles } = props;

    // state
    const [
        selectedQuickTimeSpanInMillis,
        setSelectedQuickTimeSpanInMillis
    ] = useState(chartOptions.defaultQuickTimeSpanInMillis);

    // hooks
    const { t } = useTranslation();
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
        connection: null,
        quickTimeSpanInMillis: selectedQuickTimeSpanInMillis,
        twins: timeSeriesTwinList
    });

    // callbacks
    const handleQuickTimesChange = useCallback((quickTimeInMillis: number) => {
        setSelectedQuickTimeSpanInMillis(quickTimeInMillis);
    }, []);
    const handleOnRenderTitle = useCallback(
        (options: IDropdownOption[]): JSX.Element => {
            const option = options[0];
            const iconStyles = { marginRight: '8px' };

            return (
                <div style={{ display: 'flex' }}>
                    {option.data && (
                        <Icon
                            style={iconStyles}
                            iconName="DateTime"
                            aria-hidden="true"
                        />
                    )}
                    <span>{option.text}</span>
                </div>
            );
        },
        [t]
    );
    const highChartSeriesData: Array<IHighChartSeriesData> = useMemo(
        () =>
            transformADXTimeSeriesToHighChartsSeries(data, timeSeriesTwinList),
        [data, timeSeriesTwinList]
    );
    const updateXMinAndMax = useCallback(() => {
        const nowInMillis = Date.now();
        xMinDateInMillisRef.current =
            nowInMillis - selectedQuickTimeSpanInMillis;
        xMaxDateInMillisRef.current = nowInMillis;
    }, [selectedQuickTimeSpanInMillis]);

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
                            onRenderTitle={handleOnRenderTitle}
                            hasLabel={false}
                        />
                    </Stack>
                    <HighChartsWrapper
                        styles={classNames.subComponentStyles.chartWrapper}
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
                    <ActionButton
                        iconProps={{ iconName: 'OpenInNewWindow' }}
                        onClick={() => {
                            window.open(deeplink, '_blank');
                        }}
                    >
                        {t('widgets.dataHistory.openQuery')}
                    </ActionButton>
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
