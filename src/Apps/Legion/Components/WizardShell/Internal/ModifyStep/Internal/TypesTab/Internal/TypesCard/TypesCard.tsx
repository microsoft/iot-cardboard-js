import React, { useCallback, useMemo } from 'react';
import { getDebugLogger } from '../../../../../../../../../../Models/Services/Utils';
import { ITypesCardProps } from './TypesCard.types';
import { getStyles } from './TypesCard.styles';
import { useTypes } from '../../../../../../../../Hooks/useTypes';
import {
    DetailsList,
    IColumn,
    TextField,
    SelectionMode,
    Checkbox,
    memoizeFunction
} from '@fluentui/react';
import { useEntities } from '../../../../../../../../Hooks/useEntities';
import TypeIcon from '../../../../../../../TypeIcon/TypeIcon';
import { IViewProperty } from '../../../../../../../../Models';
import { useExtendedTheme } from '../../../../../../../../../../Models/Hooks/useExtendedTheme';
import { useTranslation } from 'react-i18next';
import i18n from '../../../../../../../../../../i18n';

const debugLogging = false;
const logDebugConsole = getDebugLogger('TypesCard', debugLogging);

const getColumns = memoizeFunction((): IColumn[] => [
    {
        key: 'check-box-column',
        name: '',
        minWidth: 32,
        maxWidth: 32,
        onRender: (item: IViewProperty) => {
            return (
                <Checkbox
                    onChange={(_ev, checked) => {
                        // TODO: Integrate this with Mitch's changes
                        // checked ? deleteProperty(item.id) : addProperty(item);
                        // eslint-disable-next-line no-console
                        console.log(checked);
                    }}
                    defaultChecked={!item.isDeleted}
                />
            );
        }
    },
    {
        key: 'source-name-column',
        name: i18n.t('legionApp.modifyStep.sourceColumnHeader'),
        minWidth: 100,
        fieldName: 'sourcePropId'
    },
    {
        key: 'friendly-name-column',
        name: i18n.t('legionApp.modifyStep.friendlyNameColumnHeader'),
        minWidth: 200,
        fieldName: 'friendlyName'
    }
]);

const TypesCard: React.FC<ITypesCardProps> = (props) => {
    const { typeId } = props;
    // contexts

    // state

    // hooks
    const { getTypeById, updateType } = useTypes();
    const type = useMemo(() => getTypeById(typeId), [getTypeById, typeId]);
    const { getEntityCount } = useEntities();
    const theme = useExtendedTheme();
    const { t } = useTranslation();

    // callbacks
    const onUpdateTypeName = useCallback(
        (event) => {
            updateType({
                ...type,
                friendlyName: event.target.value
            });
        },
        [type, updateType]
    );

    // side effects

    // styles
    const classNames = getStyles(theme);

    logDebugConsole('debug', 'Render');

    const entityCount = getEntityCount(type.id);

    return (
        <div className={classNames.root}>
            <div className={classNames.leftSide}>
                <TextField
                    label={t('legionApp.modifyStep.typeFieldLabel')}
                    onBlur={onUpdateTypeName}
                    defaultValue={type.friendlyName}
                />
                <p className={classNames.leftSideTitle}>
                    {t('legionApp.modifyStep.kind')}
                </p>
                <div className={classNames.kindContainer}>
                    <TypeIcon color={type.color} icon={type.icon} />
                    <p className={classNames.kindText}>{type.kind}</p>
                </div>
                <i>
                    {entityCount.existing === 1
                        ? t('legionApp.modifyStep.existingEntity', {
                              entityCount: entityCount.existing
                          })
                        : t('legionApp.modifyStep.existingEntities', {
                              entityCount: entityCount.existing
                          })}
                </i>
                <i>
                    {entityCount.new === 1
                        ? t('legionApp.modifyStep.discoveredEntity', {
                              entityCount: entityCount.new
                          })
                        : t('legionApp.modifyStep.discoveredEntities', {
                              entityCount: entityCount.new
                          })}
                </i>
                <i>
                    {entityCount.deleted === 1
                        ? t('legionApp.modifyStep.deletedEntity', {
                              entityCount: entityCount.deleted
                          })
                        : t('legionApp.modifyStep.deletedEntities', {
                              entityCount: entityCount.deleted
                          })}
                </i>
            </div>
            <div className={classNames.rightSide}>
                <DetailsList
                    items={type.properties}
                    columns={getColumns()}
                    selectionMode={SelectionMode.none}
                />
            </div>
        </div>
    );
};

export default TypesCard;
