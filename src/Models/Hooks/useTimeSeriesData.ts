import { usePrevious } from '@fluentui/react-hooks';
import { useEffect, useMemo, useState } from 'react';
import { MockAdapter } from '../../Adapters';
import {
    ADXTableColumns,
    ADXTimeSeries,
    IADXAdapter,
    IADXConnection,
    IComponentError,
    IDataHistoryTimeSeriesTwin
} from '../Constants';
import { getDebugLogger } from '../Services/Utils';
import useAdapter from './useAdapter';

const debugLogging = false;
const logDebugConsole = getDebugLogger('useTimeSeriesData', debugLogging);

type ADXQueryOptions = {
    isNullIncluded?: boolean;
    shouldCastToDouble?: boolean;
};

interface IProp {
    adapter?: IADXAdapter | MockAdapter;
    connection: IADXConnection;
    quickTimeSpanInMillis: number;
    twins: Array<IDataHistoryTimeSeriesTwin>;
    pollingInterval?: number;
    queryOptions?: ADXQueryOptions;
    useStaticData?: boolean;
}

export const useTimeSeriesData = ({
    adapter,
    connection,
    quickTimeSpanInMillis,
    twins,
    pollingInterval,
    queryOptions = { isNullIncluded: false, shouldCastToDouble: true },
    useStaticData
}: IProp): {
    query: string;
    deeplink: string;
    data: Array<ADXTimeSeries>;
    errors: Array<IComponentError>;
    fetchTimeSeriesData: () => void;
    isLoading: boolean;
} => {
    const [data, setData] = useState<Array<ADXTimeSeries>>(null);
    const [errors, setErrors] = useState<Array<IComponentError>>([]);
    const [query, setQuery] = useState('');
    const [deeplink, setDeeplink] = useState('');
    const [connectionToQuery, setConnectionToQuery] = useState<IADXConnection>(
        null
    );
    const [isLoading, setIsLoading] = useState(false);

    const timeSeriesData = useAdapter({
        adapterMethod: (params: {
            query: string;
            connection: IADXConnection;
        }) =>
            adapter.getTimeSeriesData(
                twins.map((t) => t.seriesId),
                params.query,
                params.connection,
                useStaticData
            ),
        refetchDependencies: [adapter, connection, twins, pollingInterval],
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

        if (timeSeriesData?.adapterResult.getErrors()) {
            const errors: Array<IComponentError> = timeSeriesData?.adapterResult.getErrors();
            setErrors(errors);
        } else {
            setErrors([]);
        }
    }, [timeSeriesData?.adapterResult]);

    useEffect(() => {
        if (connection) {
            setConnectionToQuery(connection);
        } else {
            setConnectionToQuery(adapter?.getADXConnectionInformation());
        }
    }, [connection, adapter]);

    const prevQuery = usePrevious(query);
    useEffect(() => {
        let newQuery = '';
        if (connectionToQuery && quickTimeSpanInMillis && twins?.length) {
            newQuery = getBulkADXQueryFromTimeSeriesTwins(
                twins,
                quickTimeSpanInMillis,
                connectionToQuery,
                queryOptions
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

    useEffect(() => {
        setIsLoading(timeSeriesData.isLoading);
    }, [timeSeriesData.isLoading]);

    return useMemo(() => {
        return {
            query,
            deeplink,
            data,
            errors,
            fetchTimeSeriesData: fetchData,
            isLoading
        };
    }, [query, deeplink, data, errors, fetchData, isLoading]);
};

/** Constructs the bulk query based on the parsed time series twin information from data history widget
 * to be sent against ADX query using the connection data
 */
const getBulkADXQueryFromTimeSeriesTwins = (
    twins: Array<IDataHistoryTimeSeriesTwin>,
    agoTimeInMillis: number,
    connection: IADXConnection,
    queryOptions?: ADXQueryOptions
): string => {
    let query = '';

    try {
        twins?.forEach((twin, idx) => {
            /** This allows Kusto to read hypen separated names i.e. twin-table */
            query += `['${connection.kustoTableName}'] | where TimeStamp > ago(${agoTimeInMillis}ms)`;
            query += ` | where Id == '${twin.twinId}' and Key == '${twin.twinPropertyName}'`;
            query +=
                queryOptions?.shouldCastToDouble ??
                twin.chartProps.isTwinPropertyTypeCastedToNumber
                    ? ` | extend  ${ADXTableColumns.Value} = todouble(${ADXTableColumns.Value})`
                    : '';
            query += queryOptions?.isNullIncluded
                ? ''
                : ` | where isnotnull(${ADXTableColumns.Value})`;
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
