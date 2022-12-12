import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import { ADT3DSceneAdapter, MockAdapter } from '../../Adapters';
import { ICardboardModalStyles } from '../CardboardModal/CardboardModal.types';
import { ITimeSeriesBuilderStyles } from './Internal/TimeSeriesBuilder/TimeSeriesBuilder.types';
import { ITimeSeriesViewerStyles } from './Internal/TimeSeriesViewer/TimeSeriesViewer.types';

export interface IDataHistoryExplorerProps {
    adapter: ADT3DSceneAdapter | MockAdapter;
    isOpen: boolean;
    onDismiss?: () => void;
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
}
