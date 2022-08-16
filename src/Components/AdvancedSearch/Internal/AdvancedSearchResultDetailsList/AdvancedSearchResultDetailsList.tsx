import React, { useCallback, useState } from 'react';
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
    SelectionMode,
    Selection,
    Callout
} from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { IADTTwin } from '../../../../Models/Constants';
import { useTranslation } from 'react-i18next';
import PropertyInspector from '../../../PropertyInspector/PropertyInspector';
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
    const twinCount = twins.length;
    const [currentTwin, setTwin] = useState<any>(null);
    const [isVisible, { toggle: setIsVisible }] = useBoolean(false);
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });
    const columns: IColumn[] = [
        {
            key: 'twin-id',
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
            key: name,
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
                    <PropertyInspectorCalloutButton
                        twinId={currentTwin}
                        adapter={adapter}
                        iconProps={{ iconName: 'EntryView' }}
                        title={t('advancedSearch.inspectProperty')}
                        ariaLabel={t('advancedSearch.inspectProperty')}
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
            //OnTwinSelection(currentTwin);
        }
    });
    console.log(currentTwin);
    console.log(isVisible);

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
                layoutMode={DetailsListLayoutMode.fixedColumns}
                selectionPreservedOnEmptyClick={false}
                ariaLabelForSelectionColumn={t(
                    'advancedSearch.toggleSelection'
                )}
                checkButtonAriaLabel={t('advancedSearch.selectRow')}
                onRenderItemColumn={renderItemColumn}
                selectionMode={SelectionMode.single}
                selection={selection}
            />
            {isVisible && (
                <Callout target={'#resultButton'} onDismiss={setIsVisible}>
                    <PropertyInspector
                        adapter={adapter}
                        twinId={currentTwin.$dtId}
                    />
                </Callout>
            )}
        </section>
    );
};

export default styled<
    IAdvancedSearchResultDetailsListProps,
    IAdvancedSearchResultDetailsListStyleProps,
    IAdvancedSearchResultDetailsListStyles
>(AdvancedSearchResultDetailsList, getStyles);
