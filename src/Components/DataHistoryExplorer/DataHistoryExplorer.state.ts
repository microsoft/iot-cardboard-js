import produce from 'immer';
import { QuickTimeSpanKey, QuickTimeSpans } from '../../Models/Constants';
import {
    DataHistoryExplorerActionType,
    IDataHistoryExplorerAction,
    IDataHistoryExplorerState
} from './DataHistoryExplorer.types';
import { TimeSeriesViewerMode } from './Internal/TimeSeriesViewer/TimeSeriesViewer.types';

export const defaultDataHistoryExplorerState: IDataHistoryExplorerState = {
    adxConnectionInformation: null,
    timeSeriesTwins: [],
    selectedTimeSeriesId: null,
    selectedViewerMode: TimeSeriesViewerMode.Chart,
    missingDataSeriesIds: [],
    isTimeSeriesTwinCalloutVisible: false,
    explorerChartOptions: {
        yAxisType: 'independent',
        defaultQuickTimeSpanInMillis:
            QuickTimeSpans[QuickTimeSpanKey.Last15Mins],
        aggregationType: 'avg',
        xMinDateInMillis: null,
        xMaxDateInMillis: null
    },
    dataFetchFlag: false
};

export const DataHistoryExplorerReducer = produce(
    (draft: IDataHistoryExplorerState, action: IDataHistoryExplorerAction) => {
        switch (action.type) {
            case DataHistoryExplorerActionType.ADD_TIME_SERIES_TWINS: {
                const { series } = action.payload;
                draft.timeSeriesTwins.push(series);
                draft.isTimeSeriesTwinCalloutVisible = false;
                break;
            }
            case DataHistoryExplorerActionType.EDIT_TIME_SERIES_TWINS: {
                const { seriesId, series } = action.payload;
                const seriesIdx = draft.timeSeriesTwins.findIndex(
                    (tsTwin) => tsTwin.seriesId === seriesId
                );
                draft.timeSeriesTwins[seriesIdx] = series;
                draft.selectedTimeSeriesId = null;
                draft.isTimeSeriesTwinCalloutVisible = false;
                break;
            }
            case DataHistoryExplorerActionType.REMOVE_TIME_SERIES_TWINS: {
                const { seriesId } = action.payload;
                const seriesIdx = draft.timeSeriesTwins.findIndex(
                    (tsTwin) => tsTwin.seriesId === seriesId
                );
                draft.timeSeriesTwins.splice(seriesIdx, 1);
                break;
            }
            case DataHistoryExplorerActionType.SET_IS_TIME_SERIES_TWIN_CALLOUT_VISIBLE: {
                const { isVisible, selectedSeriesId } = action.payload;
                draft.isTimeSeriesTwinCalloutVisible = isVisible;
                draft.selectedTimeSeriesId = selectedSeriesId;
                break;
            }
            case DataHistoryExplorerActionType.SET_MISSING_SERIES: {
                const { seriesIds } = action.payload;
                draft.missingDataSeriesIds = seriesIds;
                break;
            }
            case DataHistoryExplorerActionType.SET_COMMAND_BAR_CHART_OPTIONS: {
                const { chartOptions } = action.payload;
                draft.explorerChartOptions = {
                    ...draft.explorerChartOptions, // keep the existing extending chart option properties like x values
                    ...chartOptions
                };
                break;
            }
            case DataHistoryExplorerActionType.SET_EXPLORER_CHART_OPTION: {
                const { option, value } = action.payload;
                draft.explorerChartOptions = {
                    ...draft.explorerChartOptions,
                    [option]: value
                };
                break;
            }
            case DataHistoryExplorerActionType.SET_ADX_CONNECTION_INFORMATION: {
                const { adxConnectionInformation } = action.payload;
                draft.adxConnectionInformation = adxConnectionInformation;
                break;
            }
            case DataHistoryExplorerActionType.SET_VIEWER_MODE: {
                const { viewerMode } = action.payload;
                draft.selectedViewerMode = viewerMode;
                break;
            }
            case DataHistoryExplorerActionType.SET_DATA_FETCH_FLAG: {
                const { dataFetchFlag } = action.payload;
                draft.dataFetchFlag = dataFetchFlag;
                break;
            }
        }
    },
    defaultDataHistoryExplorerState
);
