import React, { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    DirectionalHint,
    FocusTrapCallout,
    PrimaryButton,
    SearchBox,
    Spinner,
    SpinnerSize,
    Stack,
    Text,
    useTheme
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
    description,
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
    title,
    dataButtonTestId,
    searchBoxDataTestId,
    focusTrapTestId
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
    const styles = getCardboardListCalloutComponentStyles(theme);
    const calloutStyles = getCardboardListCalloutStyles(theme);
    return (
        <FocusTrapCallout
            {...(focusTrapTestId && {
                'data-testid': focusTrapTestId
            })}
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
            <Stack tokens={{ childrenGap: 8 }}>
                <h4 className={styles.title}>{title}</h4>
                {description && (
                    <Text className={styles.description}>{description}</Text>
                )}

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
                        {...(dataButtonTestId && {
                            'data-testid': dataButtonTestId
                        })}
                        styles={cardboardListCalloutPrimaryButtonStyles}
                        onClick={() =>
                            primaryActionProps.onPrimaryActionClick(searchText)
                        }
                        disabled={!!primaryActionProps.disabled}
                    >
                        {primaryActionProps.primaryActionLabel}
                    </PrimaryButton>
                )}
            </Stack>
        </FocusTrapCallout>
    );
};

const isCardboardListItem = (
    listItem: any
): listItem is ICardboardListItem<any> => listItem.item;

export default memo(CardboardListCallout);
