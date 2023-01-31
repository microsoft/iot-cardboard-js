import {
    ISpinnerStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { MockAdapter } from '../../Adapters';
import {
    IADTDataHistoryAdapter,
    IDataHistoryTimeSeriesTwin
} from '../../Models/Constants/Interfaces';
import { ICardboardModalStyles } from '../CardboardModal/CardboardModal.types';
import { IDataHistoryErrorHandlingWrapperStyles } from '../DataHistoryErrorHandlingWrapper/DataHistoryErrorHandlingWrapper.types';
import { ITimeSeriesBuilderStyles } from './Internal/TimeSeriesBuilder/TimeSeriesBuilder.types';
import { ITimeSeriesViewerStyles } from './Internal/TimeSeriesViewer/TimeSeriesViewer.types';

export interface IDataHistoryExplorerProps {
    adapter: IADTDataHistoryAdapter | MockAdapter;
    hasTitle?: boolean;
    timeSeriesTwins?: Array<IDataHistoryTimeSeriesTwin>;
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
    loadingSpinner?: Partial<ISpinnerStyles>;
    errorWrapper?: Partial<IDataHistoryErrorHandlingWrapperStyles>;
}

export interface IDataHistoryExplorerContext {
    adapter: IADTDataHistoryAdapter | MockAdapter;
}

export const ERROR_IMAGE_HEIGHT = 120;
