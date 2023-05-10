import React from 'react';
import { IEntitiesTabProps, TEntitiesTabStyles } from './EntitiesTab.types';
import {
    EntityTabCSSVar,
    useEntitiesTabClassNames
} from './EntitiesTab.styles';
import { getDebugLogger } from '../../../../../../../../Models/Services/Utils';
import { useEntities } from '../../../../../../Hooks/useEntities';
import { IViewEntity } from '../../../../../../Models/Wizard.types';
import TypeIcon from '../../../../../TypeIcon/TypeIcon';
import NewIcon from '../../../../../../../../Resources/Static/new.svg';
import {
    DataGrid,
    DataGridCell,
    DataGridHeader,
    DataGridHeaderCell,
    DataGridRow,
    TableColumnDefinition,
    createTableColumn
} from '@fluentui/react-table';
import { DataGridBody, Checkbox, Image } from '@fluentui/react-components';
import { CONTENT_HEIGHT } from '../../../../WizardShell.styles';
import i18n from '../../../../../../../../i18n';

const debugLogging = false;
const logDebugConsole = getDebugLogger('EntitiesTab', debugLogging);

const getColumns = (
    classNames: Record<TEntitiesTabStyles, string>,
    addEntity: (entity: IViewEntity) => void,
    deleteEntity: (entityId: string) => void
): TableColumnDefinition<IViewEntity>[] => {
    return [
        createTableColumn<IViewEntity>({
            columnId: 'selectionColumn',
            renderHeaderCell: () => '',
            renderCell: (item) => {
                return (
                    <div className={classNames.columnWrapper}>
                        <Checkbox
                            key={`checkbox-${item.id}`}
                            onChange={(_ev, checked) => {
                                checked
                                    ? deleteEntity(item.id)
                                    : addEntity(item);
                            }}
                            defaultChecked={!item.isDeleted}
                        />
                    </div>
                );
            }
        }),
        createTableColumn<IViewEntity>({
            columnId: 'idColumn',
            renderHeaderCell: () => {
                return (
                    <span className={classNames.columnHeader}>
                        {i18n.t('legionApp.modifyStep.idColumnHeader')}
                    </span>
                );
            },
            renderCell: (item) => {
                return (
                    <div className={classNames.columnWrapper}>
                        <span className={classNames.idColumn}>{item.id}</span>
                        {item.isNew && (
                            <Image
                                src={NewIcon}
                                className={classNames.newEntityIcon}
                            />
                        )}
                    </div>
                );
            }
        }),
        createTableColumn<IViewEntity>({
            columnId: 'typeColumn',
            renderHeaderCell: () => {
                return (
                    <span className={classNames.columnHeader}>
                        {i18n.t('legionApp.modifyStep.typeColumnHeader')}
                    </span>
                );
            },
            renderCell: (item) => {
                return (
                    <>
                        <TypeIcon
                            icon={item.type.icon}
                            color={item.type.color}
                        />
                        <span>{item.type.friendlyName}</span>
                    </>
                );
            }
        }),
        createTableColumn<IViewEntity>({
            columnId: 'valuesColumn',
            renderHeaderCell: () => {
                return (
                    <span className={classNames.columnHeader}>
                        {i18n.t('legionApp.modifyStep.exampleColumnHeader')}
                    </span>
                );
            },
            renderCell: (item) => {
                if (item.values) {
                    const valuesString = Object.keys(item.values)
                        .map((key) => {
                            return `${key}: ${item.values[key]}`;
                        })
                        .join(', ');
                    return (
                        <div className={classNames.columnWrapper}>
                            {valuesString}
                        </div>
                    );
                } else {
                    return <></>;
                }
            }
        })
    ];
};

const EntitiesTab: React.FC<IEntitiesTabProps> = (_props) => {
    // contexts

    // hooks
    const { entities, addEntity, deleteEntity } = useEntities();

    // state

    // callbacks

    // side effects

    // styles
    const classNames = useEntitiesTabClassNames();

    logDebugConsole('debug', 'Render');

    return (
        <div
            className={classNames.root}
            style={{ [`${EntityTabCSSVar}`]: `${CONTENT_HEIGHT - 40}px` }}
        >
            <DataGrid
                items={entities}
                columns={getColumns(classNames, addEntity, deleteEntity)}
                columnSizingOptions={{
                    selectionColumn: {
                        defaultWidth: 30,
                        minWidth: 30,
                        idealWidth: 30
                    }
                }}
                resizableColumns
            >
                <DataGridHeader>
                    <DataGridRow>
                        {({ renderHeaderCell }) => (
                            <DataGridHeaderCell>
                                {renderHeaderCell()}
                            </DataGridHeaderCell>
                        )}
                    </DataGridRow>
                </DataGridHeader>
                <DataGridBody<IViewEntity>>
                    {({ item, rowId }) => (
                        <DataGridRow<IViewEntity> key={rowId}>
                            {({ renderCell }) => (
                                <DataGridCell>{renderCell(item)}</DataGridCell>
                            )}
                        </DataGridRow>
                    )}
                </DataGridBody>
            </DataGrid>
        </div>
    );
};

export default EntitiesTab;
