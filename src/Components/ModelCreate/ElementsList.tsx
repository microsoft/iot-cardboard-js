import React from 'react';
import { ActionButton, IconButton } from '@fluentui/react/lib/Button';
import {
    DetailsList,
    DetailsListLayoutMode,
    SelectionMode,
    DetailsRow,
    IDetailsListProps,
    IColumn
} from '@fluentui/react/lib/DetailsList';
import { Text } from '@fluentui/react/lib/Text';
import { IIconProps } from '@fluentui/react/lib/Icon';
import { Stack } from '@fluentui/react/lib/Stack';
import './ElementsList.scss';

const addIcon: IIconProps = { iconName: 'Add' };
const deleteIcon: IIconProps = { iconName: 'Delete' };

interface ElementsListProps {
    t: (str: string) => string;
    noElementLabelKey: string;
    addElementLabelKey: string;
    elements: any[];
    handleNewElement: () => void;
    handleEditElement: (element: any, index: number) => void;
    handleDeleteElement: (index: number) => void;
}

const ElementsList: React.FC<ElementsListProps> = ({
    t,
    noElementLabelKey,
    addElementLabelKey,
    elements,
    handleNewElement,
    handleEditElement,
    handleDeleteElement
}) => {
    const listTableColumns = [
        {
            key: 'displayName',
            name: t('modelCreate.displayName'),
            fieldName: 'displayName',
            minWidth: 100,
            maxWidth: 300
        },
        {
            key: 'action',
            name: t('modelCreate.action'),
            fieldName: 'action',
            minWidth: 50,
            maxWidth: 50
        }
    ];

    const renderListRow: IDetailsListProps['onRenderRow'] = (props) => (
        <div onClick={() => handleEditElement(props.item, props.itemIndex)}>
            <DetailsRow
                styles={{
                    cell: {
                        display: 'flex',
                        alignItems: 'center'
                    }
                }}
                className="cb-elementslist-row"
                {...props}
            />
        </div>
    );

    function renderItemColumn(item: any, index: number, column: IColumn) {
        const fieldContent = item[column.fieldName] as string;

        switch (column.key) {
            case 'action':
                return (
                    <IconButton
                        iconProps={deleteIcon}
                        title={t('modelCreate.delete')}
                        ariaLabel={t('modelCreate.delete')}
                        onClick={(event) => {
                            event.stopPropagation();
                            handleDeleteElement(index);
                        }}
                    />
                );
            default:
                return <span>{fieldContent}</span>;
        }
    }

    return (
        <Stack>
            {elements.length === 0 && (
                <div className="cb-elementslist-empty">
                    <Text>{t(noElementLabelKey)}</Text>
                </div>
            )}
            {elements.length > 0 && (
                <DetailsList
                    selectionMode={SelectionMode.none}
                    items={elements}
                    columns={listTableColumns}
                    setKey="set"
                    layoutMode={DetailsListLayoutMode.justified}
                    onRenderRow={renderListRow}
                    onRenderItemColumn={renderItemColumn}
                    onItemInvoked={(item, index) =>
                        handleEditElement(item, index)
                    }
                />
            )}
            <ActionButton iconProps={addIcon} onClick={handleNewElement}>
                {t(addElementLabelKey)}
            </ActionButton>
        </Stack>
    );
};

export default ElementsList;
