import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import MockAdapter from '../../Adapters/MockAdapter';
import {
    IADTDataHistoryAdapter,
    IDataHistoryTimeSeriesTwin
} from '../../Models/Constants/Interfaces';
import { ICardboardModalStyles } from '../CardboardModal/CardboardModal.types';

export interface IDataHistoryExplorerModalProps {
    adapter: IADTDataHistoryAdapter | MockAdapter;
    isOpen: boolean;
    onDismiss?: () => void;
    timeSeriesTwins?: Array<IDataHistoryTimeSeriesTwin>;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IDataHistoryExplorerModalStyleProps,
        IDataHistoryExplorerModalStyles
    >;
}

export interface IDataHistoryExplorerModalStyleProps {
    theme: ITheme;
}
export interface IDataHistoryExplorerModalStyles {
    root: IStyle;
    contentStack: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IDataHistoryExplorerModalSubComponentStyles;
}

export interface IDataHistoryExplorerModalSubComponentStyles {
    modal?: Partial<ICardboardModalStyles>;
}
