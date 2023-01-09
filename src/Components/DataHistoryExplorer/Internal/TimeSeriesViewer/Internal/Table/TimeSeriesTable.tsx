import React, { useCallback, useMemo, useState } from 'react';
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
    ResponsiveMode
} from '@fluentui/react';
import { ADXTimeSeriesTableRow } from '../../../../../../Models/Constants/Types';
import { useTranslation } from 'react-i18next';
import {
    getDefaultSeriesLabel,
    transformADXTimeSeriesToTableData
} from '../../../../../../Models/SharedUtils/DataHistoryUtils';

const getClassNames = classNamesFunction<
    ITimeSeriesTableStyleProps,
    ITimeSeriesTableStyles
>();

const TimeSeriesTable: React.FC<ITimeSeriesTableProps> = (props) => {
    const {
        adxTimeSeries = [],
        timeStampFormat = TimeStampFormat.iso,
        styles
    } = props;

    // contexts

    // state
    const [selectedTimeSeries, setSelectedTimeSeries] = useState<{
        id: string;
        key: string;
    }>(
        adxTimeSeries
            ? { id: adxTimeSeries[0]?.id, key: adxTimeSeries[0]?.key }
            : undefined
    );

    // hooks
    const { t } = useTranslation();
    const dropdownOptions: IDropdownOption[] =
        adxTimeSeries?.map((series) => ({
            key: getDefaultSeriesLabel(series.id, series.key),
            text: getDefaultSeriesLabel(series.id, series.key),
            data: series
        })) || [];
    const items = useMemo(
        () =>
            adxTimeSeries
                ? transformADXTimeSeriesToTableData(
                      adxTimeSeries.find(
                          (series) =>
                              series.id === selectedTimeSeries?.id &&
                              series.key === selectedTimeSeries?.key
                      )
                  )
                : [],
        [adxTimeSeries, selectedTimeSeries]
    );
    const getColumns = useMemo(
        () => [
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
                minWidth: 200,
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
                minWidth: 100,
                isResizable: true,
                onRender: (item: ADXTimeSeriesTableRow) => item.value
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

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <div className={classNames.root}>
            <Dropdown
                options={dropdownOptions}
                defaultSelectedKey={
                    selectedTimeSeries
                        ? getDefaultSeriesLabel(
                              selectedTimeSeries.id,
                              selectedTimeSeries.key
                          )
                        : undefined
                }
                onChange={(_e, option) => setSelectedTimeSeries(option.data)}
                responsiveMode={ResponsiveMode.large}
                styles={classNames.subComponentStyles.seriesDropdown}
            />
            <DetailsList
                key={
                    selectedTimeSeries
                        ? getDefaultSeriesLabel(
                              selectedTimeSeries.id,
                              selectedTimeSeries.key
                          )
                        : undefined
                }
                selectionMode={SelectionMode.none}
                items={items}
                columns={getColumns}
                layoutMode={DetailsListLayoutMode.justified}
                styles={classNames.subComponentStyles.detailsList}
            />
        </div>
    );
};

export default styled<
    ITimeSeriesTableProps,
    ITimeSeriesTableStyleProps,
    ITimeSeriesTableStyles
>(TimeSeriesTable, getStyles);
