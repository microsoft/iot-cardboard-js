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
import { ADXTimeSeries } from '../../../../../../Models/Constants/Types';
import { useTranslation } from 'react-i18next';
import { transformADXTimeSeriesToADXTableData } from '../../../../../../Models/SharedUtils/DataHistoryUtils';
import { TimeSeriesViewerContext } from '../../TimeSeriesViewer';
import { DataHistoryExplorerContext } from '../../../../DataHistoryExplorer';
import { useTimeSeriesData } from '../../../../../../Models/Hooks/useTimeSeriesData';
import IllustrationMessage from '../../../../../IllustrationMessage/IllustrationMessage';
import GenericErrorImg from '../../../../../../Resources/Static/noResults.svg';
import { DTDLPropertyIconographyMap } from '../../../../../../Models/Constants/Constants';
import TableCommandBar from './Internal/TableCommandBar/TableCommandBar';

const getClassNames = classNamesFunction<
    ITimeSeriesTableStyleProps,
    ITimeSeriesTableStyles
>();

const TimeSeriesTable: React.FC<ITimeSeriesTableProps> = (props) => {
    const {
        quickTimeSpanInMillis,
        adxTimeSeries: adxTimeSeriesProp = [],
        timeStampFormat = TimeStampFormat.iso,
        styles
    } = props;

    // contexts
    const { adapter } = useContext(DataHistoryExplorerContext);
    const { timeSeriesTwinList } = useContext(TimeSeriesViewerContext);

    // state
    const [adxTimeSeries, setAdxTimeSeries] = useState<Array<ADXTimeSeries>>(
        adxTimeSeriesProp
    );

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    // hooks
    const { t } = useTranslation();

    const {
        query,
        data,
        fetchTimeSeriesData,
        isLoading = true
    } = useTimeSeriesData({
        adapter,
        connection: adapter.getADXConnectionInformation(),
        quickTimeSpanInMillis: quickTimeSpanInMillis,
        twins: timeSeriesTwinList,
        queryOptions: { isNullIncluded: true, shouldCastToDouble: false }
    });
    const items: Array<TimeSeriesTableRow> = useMemo(() => {
        const adxTimeSeriesTableRows =
            adxTimeSeries?.reduce((acc, adxTs) => {
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
        return adxTimeSeriesTableRows;
    }, [adxTimeSeries]);
    const getColumns: Array<IColumn> = useMemo(
        () => [
            {
                key: 'color',
                name: t('dataHistoryExplorer.viewer.table.color'),
                minWidth: 40,
                maxWidth: 60,
                isResizable: false,
                onRender: (item: TimeSeriesTableRow) => {
                    const timeSeriesTwin = timeSeriesTwinList.find(
                        (seriesTwin) => seriesTwin.seriesId === item?.seriesId
                    );
                    return timeSeriesTwin.chartProps?.color ? (
                        <span
                            style={{
                                width: 24,
                                height: 24,
                                backgroundColor:
                                    timeSeriesTwin.chartProps?.color,
                                borderRadius: '50%',
                                display: 'inline-block'
                            }}
                        />
                    ) : (
                        <span className={classNames.notSetCell}>
                            {t('dataHistoryExplorer.viewer.table.noColor')}
                        </span>
                    );
                }
            },
            {
                key: 'timestamp',
                name: t('dataHistoryExplorer.viewer.table.timestamp'),
                minWidth: 100,
                isResizable: true,
                onRender: (item: TimeSeriesTableRow) =>
                    getFormattedTimeStamp(item.timestamp)
            },
            {
                key: 'twinId',
                name: t('twinId'),
                minWidth: 100,
                isResizable: true,
                onRender: (item: TimeSeriesTableRow) => item.id
            },
            {
                key: 'twinProperty',
                name: t('dataHistoryExplorer.viewer.table.property'),
                minWidth: 100,
                isResizable: true,
                onRender: (item: TimeSeriesTableRow) => item.property
            },
            {
                key: 'value',
                name: t('dataHistoryExplorer.viewer.table.value'),
                minWidth: 40,
                isResizable: true,
                onRender: (item: TimeSeriesTableRow) => item.value
            },
            {
                key: 'type',
                name: t('dataHistoryExplorer.viewer.table.type'),
                minWidth: 40,
                maxWidth: 60,
                isResizable: true,
                onRender: (item: TimeSeriesTableRow) => {
                    const timeSeriesTwin = timeSeriesTwinList.find(
                        (seriesTwin) => seriesTwin.seriesId === item?.seriesId
                    );
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
        ],
        [adxTimeSeries]
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

    useEffect(() => {
        if (timeSeriesTwinList.length > 0 && query) {
            fetchTimeSeriesData();
        }
    }, [timeSeriesTwinList, query]);
    useEffect(() => {
        setAdxTimeSeries(data);
    }, [data]);

    return (
        <div className={classNames.root}>
            {isLoading ? (
                <Spinner
                    styles={classNames.subComponentStyles.loadingSpinner}
                    size={SpinnerSize.large}
                    label={t('dataHistoryExplorer.viewer.table.loadingMessage')}
                    ariaLive="assertive"
                    labelPosition="top"
                />
            ) : adxTimeSeries === null || adxTimeSeries?.length === 0 ? (
                <IllustrationMessage
                    descriptionText={t(
                        `dataHistoryExplorer.viewer.table.${
                            timeSeriesTwinList.length === 0
                                ? 'noSeriesMessage'
                                : 'noDataMessage'
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
