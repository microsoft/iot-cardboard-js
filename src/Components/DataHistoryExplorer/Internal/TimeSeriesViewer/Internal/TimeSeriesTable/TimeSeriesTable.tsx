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
    IDropdownOption,
    Dropdown,
    ResponsiveMode,
    IColumn,
    Spinner,
    SpinnerSize,
    ConstrainMode,
    Icon
} from '@fluentui/react';
import {
    ADXTimeSeries,
    ADXTimeSeriesTableRow
} from '../../../../../../Models/Constants/Types';
import { useTranslation } from 'react-i18next';
import {
    getSeriesName,
    transformADXTimeSeriesToTableData
} from '../../../../../../Models/SharedUtils/DataHistoryUtils';
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
    const [selectedTimeSeries, setSelectedTimeSeries] = useState<ADXTimeSeries>(
        adxTimeSeries ? adxTimeSeries[0] : undefined
    );

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    // hooks
    const { t } = useTranslation();
    const dropdownOptions: IDropdownOption[] =
        adxTimeSeries?.map((series) => ({
            key: `series-${series.seriesId}`,
            text: getSeriesName(series),
            data: series
        })) || [];
    const { query, data, fetchTimeSeriesData, isLoading } = useTimeSeriesData({
        adapter,
        connection: adapter.getADXConnectionInformation(),
        quickTimeSpanInMillis: quickTimeSpanInMillis,
        twins: timeSeriesTwinList,
        queryOptions: { isNullIncluded: true, shouldCastToDouble: false }
    });
    const items = useMemo(
        () =>
            adxTimeSeries
                ? transformADXTimeSeriesToTableData(
                      adxTimeSeries.find(
                          (series) =>
                              series.seriesId === selectedTimeSeries.seriesId
                      )
                  )
                : [],
        [adxTimeSeries, selectedTimeSeries]
    );
    const getColumns: Array<IColumn> = useMemo(
        () => [
            {
                key: 'color',
                name: t('dataHistoryExplorer.viewer.table.color'),
                minWidth: 40,
                maxWidth: 60,
                isResizable: false,
                onRender: () => {
                    const timeSeriesTwin = timeSeriesTwinList.find(
                        (seriesTwin) =>
                            seriesTwin.seriesId === selectedTimeSeries?.seriesId
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
                onRender: (item: ADXTimeSeriesTableRow) =>
                    getFormattedTimeStamp(item.timestamp)
            },
            {
                key: 'twinId',
                name: t('twinId'),
                minWidth: 100,
                isResizable: true,
                onRender: (item: ADXTimeSeriesTableRow) => item.id
            },
            {
                key: 'twinProperty',
                name: t('dataHistoryExplorer.viewer.table.property'),
                minWidth: 100,
                isResizable: true,
                onRender: (item: ADXTimeSeriesTableRow) => item.key
            },
            {
                key: 'value',
                name: t('dataHistoryExplorer.viewer.table.value'),
                minWidth: 40,
                isResizable: true,
                onRender: (item: ADXTimeSeriesTableRow) => item.value
            },
            {
                key: 'type',
                name: t('dataHistoryExplorer.viewer.table.type'),
                minWidth: 40,
                maxWidth: 60,
                isResizable: true,
                onRender: () => {
                    const timeSeriesTwin = timeSeriesTwinList.find(
                        (seriesTwin) =>
                            seriesTwin.seriesId === selectedTimeSeries?.seriesId
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
        [adxTimeSeries, selectedTimeSeries]
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

    useEffect(() => {
        if (timeSeriesTwinList.length > 0 && query) {
            fetchTimeSeriesData();
        }
    }, [timeSeriesTwinList, query]);
    useEffect(() => {
        if (data) {
            setSelectedTimeSeries(data[0]);
        }
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
            ) : timeSeriesTwinList?.length === 0 ? (
                <IllustrationMessage
                    descriptionText={t(
                        'dataHistoryExplorer.viewer.table.noSeriesMessage'
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
                    <Dropdown
                        options={dropdownOptions}
                        defaultSelectedKey={
                            selectedTimeSeries
                                ? `series-${selectedTimeSeries.seriesId}`
                                : undefined
                        }
                        onChange={(_e, option) =>
                            setSelectedTimeSeries(option.data)
                        }
                        responsiveMode={ResponsiveMode.large}
                        styles={classNames.subComponentStyles.seriesDropdown}
                    />
                    <div className={classNames.listWrapper}>
                        <DetailsList
                            key={
                                selectedTimeSeries
                                    ? `series-data-${selectedTimeSeries.seriesId}`
                                    : undefined
                            }
                            styles={classNames.subComponentStyles.detailsList}
                            selectionMode={SelectionMode.none}
                            items={items}
                            columns={getColumns}
                            layoutMode={DetailsListLayoutMode.justified}
                            constrainMode={ConstrainMode.horizontalConstrained}
                        />
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
