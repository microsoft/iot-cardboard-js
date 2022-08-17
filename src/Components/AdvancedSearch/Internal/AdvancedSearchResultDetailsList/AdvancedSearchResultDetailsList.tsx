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
    Selection
} from '@fluentui/react';
import { IADTTwin } from '../../../../Models/Constants';
import { useTranslation } from 'react-i18next';
import PropertyInspectorCalloutButton from '../../../PropertyInspector/PropertyInspectorCallout';
const getClassNames = classNamesFunction<
    IAdvancedSearchResultDetailsListStyleProps,
    IAdvancedSearchResultDetailsListStyles
>();

const AdvancedSearchResultDetailsList: React.FC<IAdvancedSearchResultDetailsListProps> = ({
    twins,
    searchedProperties,
    onTwinSelection,
    styles,
    adapter
}) => {
    const { t } = useTranslation();
    const [currentTwin, setTwin] = useState<any>(null);
    const twinCount = twins.length;

    const classNames = getClassNames(styles, {
        theme: useTheme()
    });
    const columns: IColumn[] = [
        {
            key: 'twin-id',
            name: t('twinId'),
            fieldName: '$dtId',
            isResizable: true,
            minWidth: 210,
            maxWidth: 350,
            isRowHeader: true,
            isSorted: true,
            isSortedDescending: false,
            sortAscendingAriaLabel: 'Sorted A to Z',
            sortDescendingAriaLabel: 'Sorted Z to A',
            data: 'string',
            isPadded: true
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
            minWidth: 70,
            maxWidth: 90,
            isResizable: true
        };
    });
    const renderItemColumn: IDetailsListProps['onRenderItemColumn'] = (
        item: IADTTwin,
        _itemIndex: number,
        column: IColumn
    ) => {
        const fieldContent = String(item[column.fieldName]);
        switch (column.key) {
            case 'properties':
                return (
                    <PropertyInspectorCalloutButton
                        twinId={`${currentTwin?.$dtId}`}
                        adapter={adapter}
                    />
                );
            default:
                return <span>{fieldContent}</span>;
        }
    };
    const selection = new Selection({
        getKey(item, index?) {
            return item + index;
        },
        onSelectionChanged: () => {
            setTwin(selection.getSelection());
            onTwinSelection(currentTwin);
        }
    });

    return (
        <section className={classNames.root}>
            <h3>{t('advancedSearch.results', { twinCount })}</h3>
            <DetailsList
                items={twins}
                columns={
                    additionalColumns.length > 0
                        ? columns.concat(additionalColumns)
                        : columns
                }
                layoutMode={DetailsListLayoutMode.justified}
                selectionPreservedOnEmptyClick={false}
                ariaLabelForSelectionColumn={t(
                    'advancedSearch.toggleSelection'
                )}
                checkButtonAriaLabel={t('advancedSearch.selectRow')}
                onRenderItemColumn={renderItemColumn}
                selectionMode={SelectionMode.single}
                selection={selection}
            />
        </section>
    );
};

export default styled<
    IAdvancedSearchResultDetailsListProps,
    IAdvancedSearchResultDetailsListStyleProps,
    IAdvancedSearchResultDetailsListStyles
>(AdvancedSearchResultDetailsList, getStyles);
