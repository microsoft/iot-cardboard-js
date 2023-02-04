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
    selectedTimeSeriesTwinSeriesId: null,
    selectedViewerMode: TimeSeriesViewerMode.Chart,
    missingDataSeriesIds: [],
    isTimeSeriesTwinCalloutVisible: false,
    chartOptions: {
        yAxisType: 'independent',
        defaultQuickTimeSpanInMillis:
            QuickTimeSpans[QuickTimeSpanKey.Last15Mins],
        aggregationType: 'avg',
        xMinDateInMillis: null,
        xMaxDateInMillis: null
    }
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
                const { seriesIdx, series } = action.payload;
                draft.timeSeriesTwins[seriesIdx] = series;
                draft.selectedTimeSeriesTwinSeriesId = null;
                draft.isTimeSeriesTwinCalloutVisible = false;
                break;
            }
            case DataHistoryExplorerActionType.REMOVE_TIME_SERIES_TWINS: {
                const { seriesIdx } = action.payload;
                draft.timeSeriesTwins.splice(seriesIdx, 1);
                break;
            }
            case DataHistoryExplorerActionType.SET_IS_TIME_SERIES_TWIN_CALLOUT_VISIBLE: {
                const { isVisible, selectedSeriesId } = action.payload;
                draft.isTimeSeriesTwinCalloutVisible = isVisible;
                draft.selectedTimeSeriesTwinSeriesId = selectedSeriesId;
                break;
            }
            case DataHistoryExplorerActionType.SET_MISSING_SERIES: {
                const { seriesIds } = action.payload;
                draft.missingDataSeriesIds = seriesIds;
                break;
            }
            case DataHistoryExplorerActionType.SET_CHART_OPTIONS: {
                const { chartOptions } = action.payload;
                draft.chartOptions = { ...draft.chartOptions, ...chartOptions }; // only override the common properties, keep x values
                break;
            }
            case DataHistoryExplorerActionType.SET_EXPLORER_CHART_OPTIONS: {
                const { explorerChartOptions } = action.payload;
                draft.chartOptions = explorerChartOptions; // only override the common properties, keep x values
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
        }
    },
    defaultDataHistoryExplorerState
);
