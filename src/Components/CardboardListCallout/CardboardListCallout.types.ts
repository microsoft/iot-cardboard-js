import {
    DirectionalHint,
    ICalloutProps,
    IFocusZoneProps,
    IListProps
} from '@fluentui/react';
import { ICardboardListItem } from '../CardboardList/CardboardList.types';

export interface ICardboardListCalloutProps<T = void> {
    /** name of the class to put on the root node of the callout */
    className?: string;
    /** test id for the callout primary button */
    dataButtonTestId?: string;
    /** optional sub header text on the callout describing the contents */
    description?: string;
    /** header of the callout */
    title: string;
    /** to pass if the list to be rendered is CardboardList or CardboardBasicList */
    listType: 'Complex' | 'Basic';
    /** unique identifier for this list of items. Will be joined with index */
    listKey: string;
    /** optional prop to set any specific list props needed for special cases */
    listProps?: Omit<IListProps, 'key' | 'items' | 'onRenderCell'>;
    /** optional prop to set any specific focus zone props needed for special cases */
    focusZoneProps?: Omit<IFocusZoneProps, 'isClickableOutsideFocusTrap'>;
    /** props needed for the callout */
    calloutProps?: Omit<
        ICalloutProps,
        'target' | 'isBeakVisible' | 'directionalHint' | 'onDismiss'
    >;
    /** the target id to position the callout */
    calloutTarget: string;
    /** how the callout should be positioned based on target element */
    directionalHint?: DirectionalHint;
    /** optional callback method when closing the callout */
    onDismiss?: () => void;
    /** collection of CardboardListItems or CardboardBasicListItems to include in the CardboardList or CardboardBasicList */
    listItems: (ICardboardListItem<T> | string)[];
    /** if list is being loaded (e.g. when data is pulled from adapter) */
    isListLoading?: boolean;
    /** text to be used as placeholder for the filter box */
    filterPlaceholder?: string;
    /** filter functiton to be used when a search term entered to filter list items */
    filterPredicate: (item: string | T, filterTerm: string) => void;
    /** data-testid to be set for the SearchBox component */
    searchBoxDataTestId?: string;
    /** text to be displayed when there is no item to display */
    noResultText: string;
    /** props for primary action button in the callout */
    primaryActionProps?: PrimaryActionProps;
    /** data-testid to be set for the upper most focus trap component */
    focusTrapTestId?: string;
}

type PrimaryActionProps = {
    primaryActionLabel: string;
    onPrimaryActionClick: (searchTerm: string) => void;
    disabled?: boolean;
};
