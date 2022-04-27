import React, { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    SearchBox,
    PrimaryButton,
    FocusTrapCallout,
    useTheme,
    Spinner,
    SpinnerSize,
    DirectionalHint
} from '@fluentui/react';
import { ICardboardListCalloutProps } from './CardboardListCallout.types';
import { ICardboardListItem } from '../CardboardList/CardboardList.types';
import { CardboardList } from '../CardboardList/CardboardList';
import {
    cardboardListCalloutPrimaryButtonStyles,
    getCardboardListCalloutComponentStyles,
    getCardboardListCalloutStyles
} from './CardboardListCallout.styles';
import { CardboardBasicList } from '../CardboardBasicList/CardboardBasicList';

/** This callout component consists a searchbox and list of items with an optional primary action */
const CardboardListCallout = <T extends unknown>({
    calloutProps,
    calloutTarget,
    className,
    directionalHint,
    filterPlaceholder,
    filterPredicate,
    focusZoneProps,
    isListLoading,
    listItems,
    listKey,
    listProps,
    listType,
    noResultText,
    onDismiss,
    primaryActionProps,
    searchBoxDataTestId,
    title
}: ICardboardListCalloutProps<T>) => {
    const { t } = useTranslation();
    const [searchText, setSearchText] = useState('');
    const [filteredListItems, setFilteredListItems] = useState<
        Array<ICardboardListItem<T> | string>
    >(listItems);

    const filterListItems = useCallback(
        (searchTerm: string) => {
            setFilteredListItems(
                listItems.filter((listItem) =>
                    isCardboardListItem(listItem)
                        ? filterPredicate(listItem.item, searchTerm)
                        : filterPredicate(listItem, searchTerm)
                )
            );
        },
        [filterPredicate, listItems]
    );

    useEffect(() => {
        setFilteredListItems(listItems);
    }, [listItems]);

    const theme = useTheme();
    const styles = getCardboardListCalloutComponentStyles();
    const calloutStyles = getCardboardListCalloutStyles(theme);
    return (
        <FocusTrapCallout
            className={className}
            {...calloutProps}
            focusTrapProps={{
                isClickableOutsideFocusTrap: true,
                ...focusZoneProps
            }}
            target={`#${calloutTarget}`}
            isBeakVisible={false}
            directionalHint={directionalHint ?? DirectionalHint.bottomLeftEdge}
            onDismiss={onDismiss}
            styles={calloutStyles}
        >
            <h4 className={styles.title}>{title}</h4>
            {listItems.length > 0 && (
                <SearchBox
                    {...(searchBoxDataTestId && {
                        'data-testid': searchBoxDataTestId
                    })}
                    placeholder={filterPlaceholder ?? t('search')}
                    onChange={(_event, value) => {
                        setSearchText(value);
                        filterListItems(value);
                    }}
                />
            )}

            {isListLoading ? (
                <Spinner size={SpinnerSize.xSmall} />
            ) : filteredListItems?.length === 0 ? (
                <div className={styles.resultText}>{noResultText}</div>
            ) : listType === 'Basic' ? (
                <CardboardBasicList
                    className={styles.list}
                    listProps={listProps}
                    items={filteredListItems as string[]}
                    listKey={listKey}
                    textToHighlight={searchText}
                />
            ) : (
                <CardboardList<T>
                    className={styles.list}
                    listProps={listProps}
                    items={filteredListItems as ICardboardListItem<T>[]}
                    listKey={listKey}
                    textToHighlight={searchText}
                />
            )}

            {primaryActionProps && (
                <PrimaryButton
                    styles={cardboardListCalloutPrimaryButtonStyles}
                    onClick={primaryActionProps.onPrimaryActionClick}
                >
                    {primaryActionProps.primaryActionLabel}
                </PrimaryButton>
            )}
        </FocusTrapCallout>
    );
};

const isCardboardListItem = (
    listItem: any
): listItem is ICardboardListItem<any> => listItem.item;

export default memo(CardboardListCallout);
