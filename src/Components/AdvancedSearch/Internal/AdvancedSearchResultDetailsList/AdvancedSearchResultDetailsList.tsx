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
    IconButton
} from '@fluentui/react';
import { IADTTwin } from '../../Models/Constants';
import { useTranslation } from 'react-i18next';

const getClassNames = classNamesFunction<
    IAdvancedSearchResultDetailsListStyleProps,
    IAdvancedSearchResultDetailsListStyles
>();

const AdvancedSearchResultDetailsList: React.FC<IAdvancedSearchResultDetailsListProps> = (
    props
) => {
    const { t } = useTranslation();

    const { styles } = props;
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });
    const columns: IColumn[] = [
        {
            key: `twin-id + ${Math.random()}`,
            name: t('twinId'),
            fieldName: '$dtId',
            minWidth: 100,
            maxWidth: 200,
            isResizable: true
        },
        {
            key: 'properties',
            name: t('properties'),
            minWidth: 100,
            maxWidth: 200,
            isResizable: true
        }
    ];

    const filteredItems = props.filteredTwinsResult;
    const additionalColumns = props.additionalColumns;
    const renderItemColumn: IDetailsListProps['onRenderItemColumn'] = (
        item: any,
        _itemIndex: number,
        column: IColumn
    ) => {
        const fieldContent = String(item[column.fieldName]);
        switch (column.key) {
            case 'properties':
                return (
                    <IconButton
                        iconProps={{ iconName: 'EntryView' }}
                        title={'inspect property'}
                        ariaLabel={'inspect property'}
                        onClick={(event) => {
                            event.stopPropagation();
                            alert('property inspector shows up here');
                        }}
                        className={'cb-scenes-action-button'}
                    />
                );
            default:
                return <span>{fieldContent}</span>;
        }
    };

    const onItemInvoked = useCallback((twin: IADTTwin) => {
        alert(`Twin Id ${twin.$dtId} was selected`);
    }, []);
    return (
        <div className={classNames.root}>
            <h1>{'Results (' + filteredItems.length + ')'}</h1>
            <section>
                <DetailsList
                    items={filteredItems}
                    columns={
                        additionalColumns.length > 0
                            ? columns.concat(additionalColumns)
                            : columns
                    }
                    layoutMode={DetailsListLayoutMode.fixedColumns}
                    selectionPreservedOnEmptyClick={true}
                    ariaLabelForSelectionColumn="Toggle selection"
                    ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                    checkButtonAriaLabel="select row"
                    onItemInvoked={onItemInvoked}
                    onRenderItemColumn={renderItemColumn}
                />
            </section>
        </div>
    );
};

export default styled<
    IAdvancedSearchResultDetailsListProps,
    IAdvancedSearchResultDetailsListStyleProps,
    IAdvancedSearchResultDetailsListStyles
>(AdvancedSearchResultDetailsList, getStyles);
