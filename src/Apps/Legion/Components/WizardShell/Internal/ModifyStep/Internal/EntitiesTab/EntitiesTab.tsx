import React from 'react';
import { IEntitiesTabProps, IEntitiesTabStyles } from './EntitiesTab.types';
import { getStyles } from './EntitiesTab.styles';
import { getDebugLogger } from '../../../../../../../../Models/Services/Utils';
import {
    Checkbox,
    DetailsList,
    IColumn,
    IProcessedStyleSet,
    Image,
    SelectionMode
} from '@fluentui/react';
import { useEntities } from '../../../../../../Hooks/useEntities';
import { IViewEntity } from '../../../../../../Models/Wizard.types';
import TypeIcon from '../../../../../TypeIcon/TypeIcon';
import i18n from '../../../../../../../../i18n';
import NewIcon from '../../../../../../../../Resources/Static/new.svg';

const debugLogging = false;
const logDebugConsole = getDebugLogger('EntitiesTab', debugLogging);

const getColumns = (
    addEntity: (entity: IViewEntity) => void,
    deleteEntity: (entityId: string) => void,
    classNames: IProcessedStyleSet<IEntitiesTabStyles>
): IColumn[] => [
    {
        key: 'selection-column',
        minWidth: 32,
        maxWidth: 32,
        name: '',
        onRender: (item: IViewEntity) => {
            return (
                <div className={classNames.columnWrapper}>
                    <Checkbox
                        onChange={(_ev, checked) => {
                            checked ? deleteEntity(item.id) : addEntity(item);
                        }}
                        defaultChecked={!item.isDeleted}
                    />
                </div>
            );
        }
    },
    {
        key: 'id-column',
        minWidth: 100,
        maxWidth: 100,
        name: i18n.t('legionApp.modifyStep.idColumnHeader'),
        onRender: (item: IViewEntity) => {
            return (
                <div className={classNames.columnWrapper}>
                    <span className={classNames.idColumn}>
                        {item.sourceEntityId}
                    </span>
                    {item.isNew && (
                        <Image
                            src={NewIcon}
                            className={classNames.newEntityIcon}
                        />
                    )}
                </div>
            );
        }
    },
    {
        key: 'type-column',
        minWidth: 200,
        maxWidth: 200,
        name: i18n.t('legionApp.modifyStep.typeColumnHeader'),
        fieldName: 'type',
        onRender: (item: IViewEntity) => {
            return (
                <>
                    <TypeIcon icon={item.type.icon} color={item.type.color} />
                    <span>{item.type.friendlyName}</span>
                </>
            );
        }
    },
    {
        key: 'values-column',
        minWidth: 400,
        name: i18n.t('legionApp.modifyStep.exampleColumnHeader'),
        fieldName: 'exampleValues',
        onRender: (item: IViewEntity) => {
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
    }
];

const EntitiesTab: React.FC<IEntitiesTabProps> = (_props) => {
    // contexts

    // state

    // hooks
    const { entities, addEntity, deleteEntity } = useEntities();

    // callbacks

    // side effects

    // styles
    const classNames = getStyles;

    logDebugConsole('debug', 'Render');

    return (
        <div className={classNames.root}>
            <DetailsList
                items={entities}
                columns={getColumns(addEntity, deleteEntity, classNames)}
                selectionMode={SelectionMode.none}
            />
        </div>
    );
};

export default EntitiesTab;
