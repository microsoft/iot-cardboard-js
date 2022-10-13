import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import NoResultImg from '../../../../Resources/Static/noResults.svg';
import NetworkErrorImg from '../../../../Resources/Static/corsError.svg';
import {
    getDebugLogger,
    sortAscendingOrDescending
} from '../../../../Models/Services/Utils';
import { QUERY_RESULT_LIMIT } from '../../AdvancedSearch.types';

const debugLogging = false;
const logDebugConsole = getDebugLogger(
    'AdvancedSearchResultsDetailsList',
    debugLogging
);

import ColumnPicker from '../../Internal/ColumnPicker/ColumnPicker';
const getClassNames = classNamesFunction<
    IAdvancedSearchResultDetailsListStyleProps,
    IAdvancedSearchResultDetailsListStyles
>();

const AdvancedSearchResultDetailsList: React.FC<IAdvancedSearchResultDetailsListProps> = ({
    adapter,
    containsError,
    onTwinIdSelect,
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
    const [selectedColumnNames, setSelectedColumnNames] = useState<string[]>(
        []
    );

    // callbacks
    const availableProperties = useMemo(() => {
        let properties: string[] = [];
        twins.forEach((twin) => {
            properties = Object.keys(twin).concat(properties);
        });
        properties.sort((a, b) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1));
        return new Set(properties);
    }, [twins]);

    const updateColumns = useCallback((columnToAdd: string) => {
        setSelectedColumnNames((prevValue) => {
            const columns = new Set(prevValue);
            columns.add(columnToAdd);
            return Array.from(columns);
        });
    }, []);

    const deleteColumn = (columnToRemoveKey: string) => {
        setSelectedColumnNames((currentValue) =>
            currentValue.filter((col) => col !== columnToRemoveKey)
        );
    };

    // data
    const selection = new Selection({
        getKey(item: IObjectWithKey, _index?: number) {
            return item['$dtId'];
        },
        onSelectionChanged: () => {
            // getSelection returns an array of selected elements, since this is single select first one is always going to be the correct one
            const selectionValue = selection.getSelection()[0];
            onTwinIdSelect(selectionValue ? selectionValue['$dtId'] : '');
        }
    });
    const noDataHeaderText = searchedProperties.length
        ? t('advancedSearch.noDataAfterSearchHeader')
        : t('advancedSearch.noDataBeforeSearchHeader');
    const noDataDescriptionText = searchedProperties.length
        ? t('advancedSearch.noDataAfterSearchDescription')
        : undefined;
    const noDataImage = searchedProperties.length
        ? {
              height: 100,
              src: NoResultImg
          }
        : undefined;

    // columns
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
    const additionalColumns = selectedColumnNames.map((name) => {
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
    const tableColumns = staticColumns.concat(additionalColumns);
    // mark each column based on whether it's currently the one sorted
    tableColumns.forEach((x) => {
        x.isSorted = sortKey === x.fieldName;
        x.isSortedDescending = x.isSorted ? isSortedDescending : false;
    });

    // sub renders
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
    const renderContent = () => {
        if (containsError) {
            return (
                <IllustrationMessage
                    headerText={t('advancedSearch.errorMessageHeader')}
                    descriptionText={t(
                        'advancedSearch.errorMessageDescription'
                    )}
                    type={'error'}
                    width={'wide'}
                    imageProps={{
                        height: 100,
                        src: NetworkErrorImg
                    }}
                />
            );
        } else if (isLoading) {
            return (
                <Spinner
                    size={SpinnerSize.large}
                    styles={classNames.subComponentStyles.spinner}
                />
            );
        } else if (twinCount === 0) {
            return (
                <IllustrationMessage
                    headerText={noDataHeaderText}
                    descriptionText={noDataDescriptionText}
                    type={'info'}
                    width={'wide'}
                    imageProps={noDataImage}
                />
            );
        } else {
            return (
                <DetailsList
                    items={listItems}
                    columns={tableColumns}
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

    // side effects
    useEffect(() => {
        searchedProperties.forEach((property) => {
            updateColumns(property);
        });
    }, [searchedProperties]);

    logDebugConsole(
        'debug',
        `Render. {columns, selectedColumns, availableProperties}`,
        tableColumns,
        selectedColumnNames,
        availableProperties
    );

    return (
        <section className={classNames.root}>
            <div className={classNames.listHeaderAndDropdown}>
                <h3 className={classNames.listHeader}>
                    {t('advancedSearch.results', { twinCount })}
                </h3>
                {twinCount > 0 && (
                    <ColumnPicker
                        allAvailableProperties={availableProperties}
                        addColumn={updateColumns}
                        deleteColumn={deleteColumn}
                        selectedKeys={selectedColumnNames}
                    />
                )}
            </div>
            {twinCount === QUERY_RESULT_LIMIT && (
                <span>
                    {t('advancedSearch.resultsExceededLabel', {
                        QUERY_RESULT_LIMIT
                    })}
                </span>
            )}
            <div>{renderContent()}</div>
        </section>
    );
};

export default styled<
    IAdvancedSearchResultDetailsListProps,
    IAdvancedSearchResultDetailsListStyleProps,
    IAdvancedSearchResultDetailsListStyles
>(AdvancedSearchResultDetailsList, getStyles);
