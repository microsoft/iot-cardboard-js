import {
    IIconStyles,
    IModalStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { ADTAdapter, MockAdapter } from '../../Adapters';
import { PropertyValueType } from '../../Models/Constants';
import { IAdvancedSearchResultDetailsListStyles } from './Internal/AdvancedSearchResultDetailsList/AdvancedSearchResultDetailsList.types';

export const QUERY_RESULT_LIMIT = 1000;

/** Advanced search modal */
export interface IAdvancedSearchProps {
    adapter: ADTAdapter | MockAdapter;
    allowedPropertyValueTypes: PropertyValueType[];
    isOpen: boolean;
    onDismiss: () => void;
    onTwinIdSelect: (selectedTwin: string) => void;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IAdvancedSearchStyleProps,
        IAdvancedSearchStyles
    >;
}

export interface IAdvancedSearchStyleProps {
    theme: ITheme;
}
export interface IAdvancedSearchStyles {
    content: IStyle;
    footer: IStyle;
    headerContainer: IStyle;
    title: IStyle;
    titleContainer: IStyle;
    subtitle: IStyle;
    /**
     * SubComponent styles.
     */
    subComponentStyles?: IAdvancedSearchSubComponentStyles;
}

export interface IAdvancedSearchSubComponentStyles {
    modal?: Partial<IModalStyles>;
    icon?: IIconStyles;
    advancedSearchDetailsList?: Partial<IAdvancedSearchResultDetailsListStyles>;
}
