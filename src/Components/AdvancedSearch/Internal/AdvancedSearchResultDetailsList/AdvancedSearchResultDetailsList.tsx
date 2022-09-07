import React, { useState, useCallback } from 'react';
import {
    IAdvancedSearchResultDetailsListProps,
    IAdvancedSearchResultDetailsListStyleProps,
    IAdvancedSearchResultDetailsListStyles
} from './AdvancedSearchResultDetailsList.types';
import { getStyles } from './AdvancedSearchResultDetailsList.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    DetailsList,
    DetailsListLayoutMode,
    IColumn,
    IDetailsListProps,
    SelectionMode,
    Selection,
    IObjectWithKey,
    Spinner,
    SpinnerSize
} from '@fluentui/react';
import { IADTTwin } from '../../../../Models/Constants';
import { useTranslation } from 'react-i18next';
import PropertyInspectorCallout from '../../../PropertyInspector/PropertyInspectorCallout/PropertyInspectorCallout';
import IllustrationMessage from '../../../IllustrationMessage/IllustrationMessage';
import NoResult from '../../../../Resources/Static/noResults.svg';

=========
import { sortAscendingOrDescending } from '../../../../Models/Services/Utils';
>>>>>>>>> Temporary merge branch 2
const getClassNames = classNamesFunction<
    IAdvancedSearchResultDetailsListStyleProps,
    IAdvancedSearchResultDetailsListStyles
>();

const AdvancedSearchResultDetailsList: React.FC<IAdvancedSearchResultDetailsListProps> = ({
    adapter,
    onTwinSelection,
    isLoading,
    searchedProperties,
    styles,
    twins
}) => {
    const { t } = useTranslation();
    const twinCount = twins.length;
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });
    const [sortKey, setSortKey] = useState<keyof IADTTwin>('$dtId');
    const [isSortedDescending, setSortDescending] = useState<boolean>(false);
    const listItems = twins.sort(
        sortAscendingOrDescending(sortKey, isSortedDescending)
    );

    const staticColumns: IColumn[] = [
        {
            key: 'twin-id',
            name: t('twinId'),
            fieldName: '$dtId',
            isResizable: true,
            minWidth: 100,
            maxWidth: 230,
            data: 'string',
            isPadded: true,
            onColumnClick: () => {
                setSortDescending(
                    sortKey === '$dtId' ? !isSortedDescending : false
                );
                setSortKey('$dtId');
            }
        },
        {
            key: 'properties',
            name: t('properties'),
            minWidth: 70,
            maxWidth: 90,
            isResizable: true
        }
    ];

    const additionalColumns: IColumn[] = searchedProperties.map((name) => {
        return {
            key: name,
            name: name,
            fieldName: name,
            minWidth: 100,
            maxWidth: 150,
            isResizable: true,
            onColumnClick: () => {
                setSortDescending(
                    sortKey === name ? !isSortedDescending : false
                );
                setSortKey(name);
            }
        };
    });

    const columns: IColumn[] =
        additionalColumns.length > 0
            ? staticColumns.concat(additionalColumns)
            : staticColumns;
    // mark each column based on whether it's currently the one sorted
    columns.forEach((x) => {
        x.isSorted = sortKey === x.fieldName;
        x.isSortedDescending = x.isSorted ? isSortedDescending : false;
    });

    const renderItemColumn: IDetailsListProps['onRenderItemColumn'] = (
        item: IADTTwin,
        _itemIndex: number,
        column: IColumn
    ) => {
        switch (column.key) {
            case 'properties':
                return (
                    <PropertyInspectorCallout
                        twinId={`${item.$dtId}`}
                        adapter={adapter}
                        styles={classNames.subComponentStyles.propertyInspector}
                    />
                );
            default:
                return <span>{String(item[column.fieldName])}</span>;
        }
    };
    const selection = new Selection({
        getKey(item: IObjectWithKey, _index?: number) {
            return item['$dtId'];
        },
        onSelectionChanged: () => {
            onTwinSelection?.(selection.getSelection());
        }
    });

    const getNoDataHeaderText = useCallback(() => {
        if (additionalColumns.length) {
            return t('advancedSearch.noDataAfterSearchHeader');
        } else {
            return t('advancedSearch.noDataBeforeSearchHeader');
        }
    }, [additionalColumns.length]);

    const getNoDataDescriptionText = useCallback(() => {
        if (additionalColumns.length) {
            return t('advancedSearch.noDataAfterSearchDescription');
        } else {
            return undefined;
        }
    }, [additionalColumns.length]);

    const getNoDataImage = useCallback(() => {
        if (additionalColumns.length) {
            return {
                height: 100,
                src: NoResult
            };
        } else {
            return undefined;
        }
    }, [additionalColumns.length]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <Spinner
                    size={SpinnerSize.large}
                    styles={classNames.subComponentStyles.spinner}
                />
            );
        } else if (twinCount === 0) {
            return (
                <IllustrationMessage
                    headerText={getNoDataHeaderText()}
                    descriptionText={getNoDataDescriptionText()}
                    type={'info'}
                    width={'wide'}
                    imageProps={getNoDataImage()}
                />
            );
        } else {
            return (
                <DetailsList
                    items={listItems}
                    columns={columns}
                    layoutMode={DetailsListLayoutMode.justified}
                    selectionPreservedOnEmptyClick={false}
                    ariaLabelForSelectionColumn={t(
                        'advancedSearch.toggleSelection'
                    )}
                    checkButtonAriaLabel={t('advancedSearch.selectRow')}
                    onRenderItemColumn={renderItemColumn}
                    selectionMode={SelectionMode.single}
                    selection={selection}
                    styles={classNames.subComponentStyles.detailsList}
                />
            );
        }
    };

    return (
        <section className={classNames.root}>
            <h3 className={classNames.listHeader}>
                {t('advancedSearch.results', { twinCount })}
            </h3>
            {twinCount === 1000 && (
                <span>{t('advancedSearch.resultsExceededLabel')}</span>
            )}
            {renderContent()}
        </section>
    );
};

export default styled<
    IAdvancedSearchResultDetailsListProps,
    IAdvancedSearchResultDetailsListStyleProps,
    IAdvancedSearchResultDetailsListStyles
>(AdvancedSearchResultDetailsList, getStyles);
