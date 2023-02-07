import {
    ISpinnerStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { MockAdapter } from '../../Adapters';
import ADTDataHistoryAdapter from '../../Adapters/ADTDataHistoryAdapter';
import {
    IADXConnection,
    IDataHistoryTimeSeriesTwin
} from '../../Models/Constants/Interfaces';
import { ICardboardModalStyles } from '../CardboardModal/CardboardModal.types';
import { IDataHistoryErrorHandlingWrapperStyles } from '../DataHistoryErrorHandlingWrapper/DataHistoryErrorHandlingWrapper.types';
import { ITimeSeriesBuilderStyles } from './Internal/TimeSeriesBuilder/TimeSeriesBuilder.types';
import { ITimeSeriesTwinCalloutStyles } from './Internal/TimeSeriesTwinCallout/TimeSeriesTwinCallout.types';
import { ITimeSeriesCommandBarOptions } from './Internal/TimeSeriesViewer/Internal/TimeSeriesCommandBar/TimeSeriesCommandBar.types';
import {
    ITimeSeriesViewerStyles,
    TimeSeriesViewerMode
} from './Internal/TimeSeriesViewer/TimeSeriesViewer.types';

export interface IDataHistoryExplorerProps {
    adapter: ADTDataHistoryAdapter | MockAdapter;
    hasTitle?: boolean;
    timeSeriesTwins?: Array<IDataHistoryTimeSeriesTwin>;
    defaultChartOptions?: ITimeSeriesCommandBarOptions;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IDataHistoryExplorerStyleProps,
        IDataHistoryExplorerStyles
    >;
}

export interface IDataHistoryExplorerStyleProps {
    theme: ITheme;
}
export interface IDataHistoryExplorerStyles {
    root: IStyle;
    titleWrapper: IStyle;
    title: IStyle;
    titleIcon: IStyle;
    contentStack: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IDataHistoryExplorerSubComponentStyles;
}

export interface IDataHistoryExplorerSubComponentStyles {
    modal?: Partial<ICardboardModalStyles>;
    builder?: ITimeSeriesBuilderStyles;
    viewer?: ITimeSeriesViewerStyles;
    timeSeriesTwinCallout?: Partial<ITimeSeriesTwinCalloutStyles>;
    loadingSpinner?: Partial<ISpinnerStyles>;
    errorWrapper?: Partial<IDataHistoryErrorHandlingWrapperStyles>;
}

export interface IDataHistoryExplorerChartOptions
    extends ITimeSeriesCommandBarOptions {
    xMinDateInMillis: number;
    xMaxDateInMillis: number;
}

export interface IDataHistoryExplorerState {
    adxConnectionInformation: IADXConnection;
    timeSeriesTwins: Array<IDataHistoryTimeSeriesTwin>;
    selectedTimeSeriesTwinSeriesId: string;
    selectedViewerMode: TimeSeriesViewerMode;
    missingDataSeriesIds: Array<string>;
    isTimeSeriesTwinCalloutVisible: boolean;
    explorerChartOptions?: IDataHistoryExplorerChartOptions;
    dataFetchFlag: boolean;
}

export enum DataHistoryExplorerActionType {
    ADD_TIME_SERIES_TWINS,
    EDIT_TIME_SERIES_TWINS,
    REMOVE_TIME_SERIES_TWINS,
    SET_IS_TIME_SERIES_TWIN_CALLOUT_VISIBLE,
    SET_SELECTED_TIME_SERIES_ID,
    SET_MISSING_SERIES,
    SET_COMMAND_BAR_CHART_OPTIONS,
    SET_EXPLORER_CHART_OPTION,
    SET_ADX_CONNECTION_INFORMATION,
    SET_VIEWER_MODE,
    SET_DATA_FETCH_FLAG
}

export type IDataHistoryExplorerAction =
    | {
          type: DataHistoryExplorerActionType.ADD_TIME_SERIES_TWINS;
          payload: {
              series: IDataHistoryTimeSeriesTwin;
          };
      }
    | {
          type: DataHistoryExplorerActionType.EDIT_TIME_SERIES_TWINS;
          payload: {
              seriesIdx: number;
              series: IDataHistoryTimeSeriesTwin;
          };
      }
    | {
          type: DataHistoryExplorerActionType.REMOVE_TIME_SERIES_TWINS;
          payload: {
              seriesIdx: number;
          };
      }
    | {
          type: DataHistoryExplorerActionType.SET_IS_TIME_SERIES_TWIN_CALLOUT_VISIBLE;
          payload: {
              isVisible: boolean;
              selectedSeriesId?: string;
          };
      }
    | {
          type: DataHistoryExplorerActionType.SET_MISSING_SERIES;
          payload: {
              seriesIds: Array<string>;
          };
      }
    | {
          type: DataHistoryExplorerActionType.SET_COMMAND_BAR_CHART_OPTIONS;
          payload: {
              chartOptions: ITimeSeriesCommandBarOptions;
          };
      }
    | {
          type: DataHistoryExplorerActionType.SET_EXPLORER_CHART_OPTION;
          payload: {
              option: keyof IDataHistoryExplorerChartOptions;
              value: any;
          };
      }
    | {
          type: DataHistoryExplorerActionType.SET_ADX_CONNECTION_INFORMATION;
          payload: {
              adxConnectionInformation: IADXConnection;
          };
      }
    | {
          type: DataHistoryExplorerActionType.SET_VIEWER_MODE;
          payload: {
              viewerMode: TimeSeriesViewerMode;
          };
      }
    | {
          type: DataHistoryExplorerActionType.SET_DATA_FETCH_FLAG;
          payload: {
              dataFetchFlag: boolean;
          };
      };

export const ERROR_IMAGE_HEIGHT = 120;
export const ADX_TABLE_DOWNLOAD_FILE_NAME = 'ADX Table (UTC)';
