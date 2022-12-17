import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import { MockAdapter } from '../../Adapters';
import ADTDataHistoryAdapter from '../../Adapters/ADTDataHistoryAdapter';
import { ICardboardModalStyles } from '../CardboardModal/CardboardModal.types';
import { ITimeSeriesBuilderStyles } from './Internal/TimeSeriesBuilder/TimeSeriesBuilder.types';

export interface IDataHistoryExplorerProps {
    adapter: ADTDataHistoryAdapter | MockAdapter;
    hasTitle?: boolean;
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
    // viewer?: ITimeSeriesViewerStyles;
}

export interface IDataHistoryExplorerContext {
    adapter: ADTDataHistoryAdapter | MockAdapter;
}
