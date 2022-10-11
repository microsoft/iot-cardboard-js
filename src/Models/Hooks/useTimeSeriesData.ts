import { useEffect, useMemo, useState } from 'react';
import { ADXTableColumns, ADXTimeSeries, IADXAdapter } from '../Constants';
import { getDebugLogger } from '../Services/Utils';
import useAdapter from './useAdapter';

const debugLogging = false;
const logDebugConsole = getDebugLogger('useTimeSeriesData', debugLogging);

export interface ITimeSeriesTwinData {
    twinId: string;
    twinPropertyName: string;
}

interface IProp {
    adapter: IADXAdapter;
    quickTimeSpan: number;
    twins: Array<ITimeSeriesTwinData>;
    pollingInterval?: number;
}

export const useTimeSeriesData = ({
    adapter,
    quickTimeSpan,
    twins,
    pollingInterval
}: IProp) => {
    const [data, setData] = useState<Array<ADXTimeSeries>>(null);

    const timeSeriesData = useAdapter({
        adapterMethod: (params: { query: string }) =>
            adapter.getTimeSeriesData(params.query),
        refetchDependencies: [adapter, twins, pollingInterval],
        isAdapterCalledOnMount: false,
        isLongPolling: pollingInterval ? true : false,
        pollingIntervalMillis: pollingInterval
    });

    /**
     * After getting time series data from adapter, parse it in a structure of
     * [timestamp, value] and store it as data to expose for consumers of this hook
     *  */
    useEffect(() => {
        if (timeSeriesData?.adapterResult?.result?.data) {
            logDebugConsole(
                'debug',
                `[END]: Fetching time series data finished: `,
                timeSeriesData?.adapterResult?.result?.data
            );
            setData(timeSeriesData?.adapterResult?.result?.data);
        } else {
            setData(null);
        }
    }, [timeSeriesData?.adapterResult.result]);

    const adxQuery = useMemo((): string => {
        const connection = adapter.getADXConnectionInformation();
        let query = '';
        if (connection && quickTimeSpan && twins.length) {
            const timeFrom = convertQuickTimeSpanToDate(quickTimeSpan);
            const timeTo = Date.now();
            try {
                twins.forEach((twin, idx) => {
                    query += `${connection.kustoTableName} | where TimeStamp between (datetime(${timeFrom}) .. datetime(${timeTo}))`;
                    query += `| where Id == "${twin.twinId}") and Key == "${twin.twinPropertyName}"`;
                    query += `| project ${ADXTableColumns.TimeStamp}, ${ADXTableColumns.Id}, ${ADXTableColumns.Key}, ${ADXTableColumns.Value}`;
                    if (idx < twins.length - 1) {
                        query += ';';
                    }
                });
            } catch (error) {
                console.error('Failed to build ADX query', error.message);
            }
        }
        return query;
    }, [adapter, quickTimeSpan, twins]);

    const adxDeeplink = useMemo(() => {
        const connection = adapter.getADXConnectionInformation();
        let deeplink = '';
        if (connection) {
            try {
                deeplink +=
                    connection.kustoClusterUrl +
                    '/' +
                    connection.kustoDatabaseName +
                    '?web=1&query=' +
                    adxQuery;
            } catch (error) {
                console.error('Failed to build ADX deeplink', error.message);
            }
        }
        return deeplink;
    }, [adapter, adxQuery]);

    return {
        query: adxQuery,
        deeplink: adxDeeplink,
        data,
        fetchTimeSeriesData: () => {
            logDebugConsole(
                'debug',
                `[START]: Fetching time series data using query "${adxQuery}"`
            );
            timeSeriesData.callAdapter({ query: adxQuery });
        }
    };
};

const convertQuickTimeSpanToDate = (quickTimeInMillis: number): Date => {
    return new Date(Date.now() - quickTimeInMillis);
};
