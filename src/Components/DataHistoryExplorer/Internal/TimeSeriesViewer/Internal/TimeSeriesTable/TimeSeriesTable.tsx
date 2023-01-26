import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import {
    ITimeSeriesTableProps,
    ITimeSeriesTableStyleProps,
    ITimeSeriesTableStyles,
    TimeSeriesTableRow,
    TimeStampFormat
} from './TimeSeriesTable.types';
import { getStyles } from './TimeSeriesTable.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    DetailsList,
    DetailsListLayoutMode,
    SelectionMode,
    IColumn,
    Spinner,
    SpinnerSize,
    ConstrainMode,
    Icon,
    ScrollablePane,
    IDetailsHeaderProps,
    IRenderFunction,
    Sticky
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { usePrevious } from '@fluentui/react-hooks';
import { transformADXTimeSeriesToADXTableData } from '../../../../../../Models/SharedUtils/DataHistoryUtils';
import { TimeSeriesViewerContext } from '../../TimeSeriesViewer';
import { DataHistoryExplorerContext } from '../../../../DataHistoryExplorer';
import { useTimeSeriesData } from '../../../../../../Models/Hooks/useTimeSeriesData';
import IllustrationMessage from '../../../../../IllustrationMessage/IllustrationMessage';
import GenericErrorImg from '../../../../../../Resources/Static/noResults.svg';
import { DTDLPropertyIconographyMap } from '../../../../../../Models/Constants/Constants';
import TableCommandBar from './Internal/TableCommandBar/TableCommandBar';
import {
    getDebugLogger,
    sortAscendingOrDescending
} from '../../../../../../Models/Services/Utils';
import DataHistoryErrorHandlingWrapper from '../../../../../DataHistoryErrorHandlingWrapper/DataHistoryErrorHandlingWrapper';
import { ERROR_IMAGE_HEIGHT } from '../../TimeSeriesViewer.types';

const debugLogging = false;
const logDebugConsole = getDebugLogger('TimeSeriesTable', debugLogging);

const getClassNames = classNamesFunction<
    ITimeSeriesTableStyleProps,
    ITimeSeriesTableStyles
>();

const TimeSeriesTable: React.FC<ITimeSeriesTableProps> = (props) => {
    const {
        quickTimeSpanInMillis,
        timeStampFormat = TimeStampFormat.iso,
        styles
    } = props;

    // contexts
    const { adapter } = useContext(DataHistoryExplorerContext);
    const { timeSeriesTwinList } = useContext(TimeSeriesViewerContext);

    // state
    const [items, setItems] = useState<Array<TimeSeriesTableRow>>([]);

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    // hooks
    const { t } = useTranslation();
    const {
        query,
        data,
        errors,
        fetchTimeSeriesData,
        isLoading = true
    } = useTimeSeriesData({
        adapter,
        connection: adapter.getADXConnectionInformation(),
        quickTimeSpanInMillis: quickTimeSpanInMillis,
        twins: timeSeriesTwinList,
        queryOptions: { isNullIncluded: true, shouldCastToDouble: false }
    });
    const getColumns: Array<IColumn> = useMemo(
        () => [
            {
                key: 'timestamp',
                name: t('dataHistoryExplorer.viewer.table.columns.timestamp'),
                minWidth: 100,
                maxWidth: 180,
                isResizable: true,
                onRender: (item: TimeSeriesTableRow) =>
                    getFormattedTimeStamp(item.timestamp)
            },
            {
                key: 'seriesLabel',
                name: t('dataHistoryExplorer.viewer.table.columns.series'),
                minWidth: 100,
                isResizable: true,
                onRender: (item: TimeSeriesTableRow) => {
                    const timeSeriesTwin = timeSeriesTwinList.find(
                        (seriesTwin) => seriesTwin.seriesId === item?.seriesId
                    );
                    return (
                        <div
                            className={
                                classNames.subComponentStyles.seriesColumn({
                                    color: timeSeriesTwin?.chartProps?.color
                                }).root
                            }
                        >
                            {timeSeriesTwin.label ? (
                                <span>{timeSeriesTwin.label}</span>
                            ) : (
                                <>
                                    <span>{timeSeriesTwin.twinId}</span>
                                    <span>
                                        ({timeSeriesTwin.twinPropertyName})
                                    </span>
                                </>
                            )}
                        </div>
                    );
                }
            },
            {
                key: 'value',
                name: t('dataHistoryExplorer.viewer.table.columns.value'),
                minWidth: 60,
                isResizable: true,
                onRender: (item: TimeSeriesTableRow) => item.value
            },
            {
                key: 'type',
                name: t('dataHistoryExplorer.viewer.table.columns.type'),
                minWidth: 40,
                maxWidth: 60,
                isResizable: true,
                onRender: (item: TimeSeriesTableRow) => {
                    const timeSeriesTwin = timeSeriesTwinList.find(
                        (seriesTwin) => seriesTwin.seriesId === item?.seriesId
                    );
                    if (timeSeriesTwin) {
                        const propertyIcon =
                            DTDLPropertyIconographyMap[
                                timeSeriesTwin.twinPropertyType
                            ];
                        return (
                            <Icon
                                iconName={propertyIcon.icon}
                                aria-hidden="true"
                                title={propertyIcon.text}
                            />
                        );
                    }
                }
            }
        ],
        [timeSeriesTwinList]
    );

    // callbacks
    const getFormattedTimeStamp = useCallback(
        (timeStamp: number | string) => {
            switch (timeStampFormat) {
                case TimeStampFormat.date:
                    return new Date(timeStamp).toLocaleString();
                case TimeStampFormat.iso:
                    return new Date(timeStamp).toISOString();
                default:
                    return timeStamp;
            }
        },
        [timeStampFormat]
    );
    const onRenderDetailsHeader = (
        detailsHeaderProps: IDetailsHeaderProps,
        defaultRender: IRenderFunction<IDetailsHeaderProps>
    ) => (
        <Sticky>
            {defaultRender({
                ...detailsHeaderProps,
                styles: { root: { paddingTop: 0 } }
            })}
        </Sticky>
    );

    // side-effects
    const prevQuery = usePrevious(query);
    useEffect(() => {
        if (query && query !== prevQuery) {
            logDebugConsole('debug', `Query to send for Table: ${query}`);
            fetchTimeSeriesData();
        }
    }, [query]);
    useEffect(() => {
        const adxTimeSeriesTableRows: Array<TimeSeriesTableRow> =
            data?.reduce((acc, adxTs) => {
                const transformedADXRow = transformADXTimeSeriesToADXTableData(
                    adxTs
                ); // flatten the adxTimeSeries to individual rows
                transformedADXRow.map(
                    (adxRow, idxR) =>
                        acc.push({
                            ...adxRow,
                            seriesId: adxTs.seriesId,
                            property: adxRow.key,
                            key: adxTs.seriesId + idxR
                        } as TimeSeriesTableRow) // cannot use the ADXTimeSeriesTableRow type since key cannot be used as a unique DOM key for rendering))
                );
                return acc;
            }, []) || [];
        adxTimeSeriesTableRows.sort(sortAscendingOrDescending('timestamp'));
        logDebugConsole(
            'debug',
            `Number of rows: ${adxTimeSeriesTableRows.length}`
        );
        setItems(adxTimeSeriesTableRows);
    }, [data]);

    return (
        <div className={classNames.root}>
            {isLoading ? (
                <Spinner
                    styles={classNames.subComponentStyles.loadingSpinner}
                    size={SpinnerSize.large}
                    label={t(
                        'dataHistoryExplorer.viewer.table.messages.loading'
                    )}
                    ariaLive="assertive"
                    labelPosition="top"
                />
            ) : errors.length > 0 ? (
                <DataHistoryErrorHandlingWrapper
                    error={errors[0]}
                    imgHeight={ERROR_IMAGE_HEIGHT}
                    styles={classNames.subComponentStyles.errorWrapper}
                />
            ) : data === null || data?.length === 0 ? (
                <IllustrationMessage
                    descriptionText={t(
                        `dataHistoryExplorer.viewer.table.messages.${
                            timeSeriesTwinList.length === 0
                                ? 'noSeries'
                                : 'noData'
                        }`
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
                    <TableCommandBar data={items} />
                    <div className={classNames.listWrapper}>
                        <ScrollablePane>
                            <DetailsList
                                styles={
                                    classNames.subComponentStyles.detailsList
                                }
                                key={'adx-series-data'}
                                selectionMode={SelectionMode.none}
                                items={items}
                                columns={getColumns}
                                layoutMode={DetailsListLayoutMode.justified}
                                constrainMode={
                                    ConstrainMode.horizontalConstrained
                                }
                                onRenderDetailsHeader={onRenderDetailsHeader}
                            />
                        </ScrollablePane>
                    </div>
                </>
            )}
        </div>
    );
};

export default styled<
    ITimeSeriesTableProps,
    ITimeSeriesTableStyleProps,
    ITimeSeriesTableStyles
>(TimeSeriesTable, getStyles);
