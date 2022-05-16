import React from 'react';
import {
    ActionButton,
    IconButton,
    DetailsList,
    DetailsListLayoutMode,
    SelectionMode,
    DetailsRow,
    IDetailsListProps,
    IColumn,
    Text,
    Stack,
    IIconProps
} from '@fluentui/react';
import './ElementsList.scss';
import { FormMode } from '../../Models/Constants/Enums';
import { useTranslation } from 'react-i18next';

const addIcon: IIconProps = { iconName: 'Add' };
const deleteIcon: IIconProps = { iconName: 'Delete' };
const editIcon: IIconProps = { iconName: 'Edit' };

interface ElementsListProps {
    noElementLabelKey: string;
    addElementLabelKey: string;
    elements: any[];
    handleNewElement: () => void;
    handleEditElement: (
        element: any,
        index: number,
        formControlMode?: FormMode
    ) => void;
    handleDeleteElement: (index: number) => void;
    formControlMode?: FormMode;
}

const ElementsList: React.FC<ElementsListProps> = ({
    noElementLabelKey,
    addElementLabelKey,
    elements,
    handleNewElement,
    handleEditElement,
    handleDeleteElement,
    formControlMode = FormMode.Edit
}) => {
    const { t } = useTranslation();

    const listTableColumns = [
        {
            key: 'name',
            name: t('name'),
            fieldName: 'name',
            minWidth: 100,
            maxWidth: 300,
            headerClassName: 'cb-detail-list-header-cell'
        }
    ];

    if (formControlMode !== FormMode.Readonly) {
        listTableColumns.push({
            key: 'action',
            name: t('action'),
            fieldName: 'action',
            minWidth: 50,
            maxWidth: 50,
            headerClassName: 'cb-detail-list-header-cell'
        });
    }

    const renderListRow: IDetailsListProps['onRenderRow'] = (props) => (
        <div
            onClick={() => {
                handleEditElement(props.item, props.itemIndex, formControlMode);
            }}
        >
            <DetailsRow
                styles={{
                    cell: {
                        display: 'flex',
                        alignItems: 'center'
                    }
                }}
                className={`cb-elementslist-row ${
                    formControlMode === FormMode.Readonly
                        ? 'cb-readonly-row'
                        : ''
                }`}
                {...props}
            />
        </div>
    );

    function renderItemColumn(item: any, index: number, column: IColumn) {
        const fieldContent = item[column.fieldName] as string;

        switch (column.key) {
            case 'action':
                return (
                    <>
                        <IconButton
                            iconProps={editIcon}
                            title={t('edit')}
                            ariaLabel={t('edit')}
                            onClick={(event) => {
                                event.stopPropagation();
                                handleEditElement(item, index, formControlMode);
                            }}
                        />
                        <IconButton
                            iconProps={deleteIcon}
                            title={t('delete')}
                            ariaLabel={t('delete')}
                            onClick={(event) => {
                                event.stopPropagation();
                                handleDeleteElement(index);
                            }}
                        />
                    </>
                );
            default:
                return <span>{fieldContent}</span>;
        }
    }

    return (
        <Stack>
            {(!elements || elements.length === 0) && (
                <div className="cb-elementslist-empty">
                    <Text>{t(noElementLabelKey)}</Text>
                </div>
            )}
            {elements?.length > 0 && (
                <DetailsList
                    className="cb-detail-list"
                    selectionMode={SelectionMode.none}
                    items={elements}
                    columns={listTableColumns}
                    setKey="set"
                    layoutMode={DetailsListLayoutMode.justified}
                    onRenderRow={renderListRow}
                    onRenderItemColumn={renderItemColumn}
                    onItemInvoked={(item, index) => {
                        if (formControlMode === FormMode.Edit) {
                            handleEditElement(item, index);
                        }
                    }}
                />
            )}
            {formControlMode !== FormMode.Readonly && (
                <ActionButton iconProps={addIcon} onClick={handleNewElement}>
                    {t(addElementLabelKey)}
                </ActionButton>
            )}
        </Stack>
    );
};

export default ElementsList;
