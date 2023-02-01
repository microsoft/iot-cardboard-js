import { IIconStyles, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import { MockAdapter } from '../../Adapters';
import { IADTAdapter, PropertyValueType } from '../../Models/Constants';
import { ICardboardModalStyles } from '../CardboardModal/CardboardModal.types';
import { IAdvancedSearchResultDetailsListStyles } from './Internal/AdvancedSearchResultDetailsList/AdvancedSearchResultDetailsList.types';

export const QUERY_RESULT_LIMIT = 1000;

/** Advanced search modal */
export interface IAdvancedSearchProps {
    adapter: IADTAdapter | MockAdapter;
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
    /**
     * SubComponent styles.
     */
    subComponentStyles?: IAdvancedSearchSubComponentStyles;
}

export interface IAdvancedSearchSubComponentStyles {
    modal?: ICardboardModalStyles;
    icon?: IIconStyles;
    advancedSearchDetailsList?: Partial<IAdvancedSearchResultDetailsListStyles>;
}
