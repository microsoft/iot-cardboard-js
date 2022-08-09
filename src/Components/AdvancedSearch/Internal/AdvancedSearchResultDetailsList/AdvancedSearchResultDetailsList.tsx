import React, { useCallback } from 'react';
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
    IconButton,
    SelectionMode
} from '@fluentui/react';
import { IADTTwin } from '../../../../Models/Constants';
import { useTranslation } from 'react-i18next';
const getClassNames = classNamesFunction<
    IAdvancedSearchResultDetailsListStyleProps,
    IAdvancedSearchResultDetailsListStyles
>();

const AdvancedSearchResultDetailsList: React.FC<IAdvancedSearchResultDetailsListProps> = ({
    twins,
    searchedProperties,
    OnTwinSelection,
    styles,
    adapter
}) => {
    const { t } = useTranslation();

    const classNames = getClassNames(styles, {
        theme: useTheme()
    });
    const columns: IColumn[] = [
        {
            key: `twin-id + ${Math.random()}`,
            name: t('twinId'),
            fieldName: '$dtId',
            minWidth: 50,
            maxWidth: 200,
            isResizable: true
        },
        {
            key: 'properties',
            name: t('properties'),
            minWidth: 50,
            maxWidth: 200,
            isResizable: true
        }
    ];

    const additionalColumns: IColumn[] = searchedProperties.map((name) => {
        return {
            key: name + Math.random(),
            name: name,
            fieldName: name,
            minWidth: 50,
            maxWidth: 200,
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
                    <IconButton
                        iconProps={{ iconName: 'EntryView' }}
                        title={t('advancedSearch.inspectProperty')}
                        ariaLabel={t('advancedSearch.inspectProperty')}
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                        className={'cb-scenes-action-button'}
                    />
                );
            default:
                return <span>{fieldContent}</span>;
        }
    };

    return (
        <section className={classNames.root}>
            <h3>{'Results (' + twins.length + ')'}</h3>
            <div>
                <DetailsList
                    items={twins}
                    columns={
                        additionalColumns.length > 0
                            ? columns.concat(additionalColumns)
                            : columns
                    }
                    layoutMode={DetailsListLayoutMode.fixedColumns}
                    selectionPreservedOnEmptyClick={false}
                    ariaLabelForSelectionColumn={t(
                        'advancedSearch.toggleSelection'
                    )}
                    checkButtonAriaLabel={t('selectRow')}
                    onRenderItemColumn={renderItemColumn}
                    selectionMode={SelectionMode.single}
                />
            </div>
        </section>
    );
};

export default styled<
    IAdvancedSearchResultDetailsListProps,
    IAdvancedSearchResultDetailsListStyleProps,
    IAdvancedSearchResultDetailsListStyles
>(AdvancedSearchResultDetailsList, getStyles);
