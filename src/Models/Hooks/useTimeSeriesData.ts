import { usePrevious } from '@fluentui/react-hooks';
import { useEffect, useMemo, useState } from 'react';
import { MockAdapter } from '../../Adapters';
import {
    ADXTableColumns,
    ADXTimeSeries,
    IADXAdapter,
    IADXConnection,
    IDataHistoryWidgetTimeSeriesTwin
} from '../Constants';
import { getDebugLogger } from '../Services/Utils';
import useAdapter from './useAdapter';

const debugLogging = false;
const logDebugConsole = getDebugLogger('useTimeSeriesData', debugLogging);

interface IProp {
    adapter?: IADXAdapter | MockAdapter;
    connectionString: string;
    quickTimeSpanInMillis: number;
    twins: Array<IDataHistoryWidgetTimeSeriesTwin>;
    pollingInterval?: number;
}

export const useTimeSeriesData = ({
    adapter,
    connectionString,
    quickTimeSpanInMillis,
    twins,
    pollingInterval
}: IProp): {
    query: string;
    deeplink: string;
    data: Array<ADXTimeSeries>;
    fetchTimeSeriesData: () => void;
    isLoading: boolean;
} => {
    const [data, setData] = useState<Array<ADXTimeSeries>>(null);
    const [query, setQuery] = useState('');
    const [deeplink, setDeeplink] = useState('');
    const [connectionToQuery, setConnectionToQuery] = useState<IADXConnection>(
        null
    );

    const timeSeriesData = useAdapter({
        adapterMethod: (params: {
            query: string;
            connection: IADXConnection;
        }) => adapter.getTimeSeriesData(params.query, params.connection),
        refetchDependencies: [
            adapter,
            connectionString,
            twins,
            pollingInterval
        ],
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

    useEffect(() => {
        if (connectionString) {
            setConnectionToQuery(
                generateADXConnectionFromString(connectionString)
            );
        } else {
            setConnectionToQuery(adapter?.getADXConnectionInformation());
        }
    }, [connectionString, adapter]);

    const prevQuery = usePrevious(query);
    useEffect(() => {
        let newQuery = '';
        if (connectionToQuery && quickTimeSpanInMillis && twins?.length) {
            newQuery = getBulkADXQueryFromTimeSeriesTwins(
                twins,
                quickTimeSpanInMillis,
                connectionToQuery
            );
        }
        if (prevQuery !== newQuery) {
            setQuery(newQuery);
        }
    }, [connectionToQuery, quickTimeSpanInMillis, twins]);

    const prevDeeplink = usePrevious(deeplink);
    useEffect(() => {
        const newDeeplink = getADXDeeplinkForWeb(connectionToQuery, query);
        if (prevDeeplink !== newDeeplink) {
            setDeeplink(newDeeplink);
        }
    }, [connectionToQuery, query]);

    const fetchData = () => {
        if (connectionToQuery && query) {
            logDebugConsole(
                'debug',
                `[START]: Fetching time series data using query "${query}"`
            );
            timeSeriesData.callAdapter({
                query,
                connection: connectionToQuery
            });
        }
    };

    return useMemo(() => {
        return {
            query,
            deeplink,
            data,
            fetchTimeSeriesData: fetchData,
            isLoading: timeSeriesData.isLoading
        };
    }, [query, deeplink, data, fetchData, timeSeriesData.isLoading]);
};

const generateADXConnectionFromString = (
    connectionString: string
): IADXConnection | null => {
    if (connectionString) {
        try {
            const parts = connectionString.split(';');
            return {
                kustoClusterUrl: parts[0].split('=')[1],
                kustoDatabaseName: parts[1].split('=')[1],
                kustoTableName: parts[2].split('=')[1]
            };
        } catch (error) {
            return null;
        }
    } else {
        return null;
    }
};

/** Constructs the bulk query based on the parsed time series twin information from data history widget
 * to be sent against ADX query using the connection data
 */
const getBulkADXQueryFromTimeSeriesTwins = (
    twins: Array<IDataHistoryWidgetTimeSeriesTwin>,
    agoTimeInMillis: number,
    connection: IADXConnection
): string => {
    let query = '';

    try {
        twins?.forEach((twin, idx) => {
            query += `${connection.kustoTableName} | where TimeStamp > ago(${agoTimeInMillis}ms)`;
            query += ` | where Id == '${twin.twinId}' and Key == '${twin.twinPropertyName}'`;
            query += ' | order by TimeStamp asc';
            query += ` | project ${ADXTableColumns.TimeStamp}, ${ADXTableColumns.Id}, ${ADXTableColumns.Key}, ${ADXTableColumns.Value}`;
            if (idx < twins.length - 1) {
                query += ';';
            }
        });
    } catch (error) {
        console.error('Failed to build ADX query', error.message);
    }
    return query;
};

/** Constructs deeplink for ADX query to be shared and viewed in ADX Web UI tool
 */
const getADXDeeplinkForWeb = (
    connection: IADXConnection,
    query: string
): string => {
    let deeplink = '';
    if (connection) {
        try {
            deeplink +=
                connection.kustoClusterUrl +
                '/' +
                connection.kustoDatabaseName +
                '?web=1&query=' +
                query;
        } catch (error) {
            console.error('Failed to build ADX deeplink', error.message);
        }
    }
    return deeplink;
};
