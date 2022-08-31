import React, { useState } from 'react';
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
    IObjectWithKey
} from '@fluentui/react';
import { IADTTwin } from '../../../../Models/Constants';
import { useTranslation } from 'react-i18next';
import PropertyInspectorCallout from '../../../PropertyInspector/PropertyInspectorCallout/PropertyInspectorCallout';
import { sortAscendingOrDescending } from '../../../../Models/Services/Utils';
const getClassNames = classNamesFunction<
    IAdvancedSearchResultDetailsListStyleProps,
    IAdvancedSearchResultDetailsListStyles
>();

const AdvancedSearchResultDetailsList: React.FC<IAdvancedSearchResultDetailsListProps> = ({
    adapter,
    onTwinSelection,
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

    return (
        <section className={classNames.root}>
            <h3 className={classNames.listHeader}>
                {t('advancedSearch.results', { twinCount })}
            </h3>
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
        </section>
    );
};

export default styled<
    IAdvancedSearchResultDetailsListProps,
    IAdvancedSearchResultDetailsListStyleProps,
    IAdvancedSearchResultDetailsListStyles
>(AdvancedSearchResultDetailsList, getStyles);
