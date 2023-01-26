import {
    ICalloutContentStyles,
    IImageStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITextStyles,
    ITheme
} from '@fluentui/react';
import { IComponentError } from '../../Models/Constants/Interfaces';
import { IllustrationMessageStyles } from '../IllustrationMessage/IllustrationMessage.types';

export interface IDataHistoryErrorHandlingWrapperProps {
    error: IComponentError;
    imgHeight?: number;

    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IDataHistoryErrorHandlingWrapperStyleProps,
        IDataHistoryErrorHandlingWrapperStyles
    >;
}

export interface IDataHistoryErrorHandlingWrapperStyleProps {
    theme: ITheme;
}
export interface IDataHistoryErrorHandlingWrapperStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IDataHistoryErrorHandlingWrapperSubComponentStyles;
}

export interface IDataHistoryErrorHandlingWrapperSubComponentStyles {
    calloutStyles?: Partial<ICalloutContentStyles>;
    calloutText?: ITextStyles;
    image?: IImageStyles;
    illustrationMessage?: Partial<IllustrationMessageStyles>;
}

/**
 * List of specific ADX service errors, see a full list of errors here:
 * https://learn.microsoft.com/en-us/azure/data-explorer/kusto/api/netfx/kusto-data-client-errors and
 * https://learn.microsoft.com/en-us/azure/data-explorer/error-codes
 */
export enum DataHistoryServiceErrorCodes {
    General_BadRequest = 'General_BadRequest',
    BadRequest_EntityNotFound = 'BadRequest_EntityNotFound',
    Forbidden = 'Forbidden'
}
