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
    SelectionMode,
    Selection,
    IObjectWithKey
} from '@fluentui/react';
import { IADTTwin } from '../../../../Models/Constants';
import { useTranslation } from 'react-i18next';
import PropertyInspectorCallout from '../../../PropertyInspector/PropertyInspectorCallout/PropertyInspectorCallout';
import IllustrationMessage from '../../../IllustrationMessage/IllustrationMessage';
import NoResult from '../../../../Resources/Static/noResults.svg';

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
    const columns: IColumn[] = [
        {
            key: 'twin-id',
            name: t('twinId'),
            fieldName: '$dtId',
            isResizable: true,
            minWidth: 100,
            maxWidth: 230,
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
            minWidth: 100,
            maxWidth: 150,
            isResizable: true
        };
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
            return 'No twins found';
        } else {
            return 'Add search criteria to get started';
        }
    }, [additionalColumns.length]);

    const getNoDataDescriptionText = useCallback(() => {
        if (additionalColumns.length) {
            return 'Refine your search and try again';
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

    return (
        <section className={classNames.root}>
            <h3 className={classNames.listHeader}>
                {t('advancedSearch.results', { twinCount })}
            </h3>
            {twinCount === 1000 && (
                <span>
                    There were more than 1000 results, add more filters to
                    refine the results.
                </span>
            )}
            {twinCount === 0 ? (
                <IllustrationMessage
                    headerText={getNoDataHeaderText()}
                    descriptionText={getNoDataDescriptionText()}
                    type={'info'}
                    width={'wide'}
                    imageProps={getNoDataImage()}
                />
            ) : (
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
                    styles={classNames.subComponentStyles.detailsList}
                />
            )}
        </section>
    );
};

export default styled<
    IAdvancedSearchResultDetailsListProps,
    IAdvancedSearchResultDetailsListStyleProps,
    IAdvancedSearchResultDetailsListStyles
>(AdvancedSearchResultDetailsList, getStyles);
