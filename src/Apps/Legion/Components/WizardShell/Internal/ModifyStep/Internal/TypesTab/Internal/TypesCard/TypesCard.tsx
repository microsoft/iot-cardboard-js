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
    Checkbox
} from '@fluentui/react';
import { useEntities } from '../../../../../../../../Hooks/useEntities';
import TypeIcon from '../../../../../../../TypeIcon/TypeIcon';
import { IViewProperty } from '../../../../../../../../Models';
import { useExtendedTheme } from '../../../../../../../../../../Models/Hooks/useExtendedTheme';
import { useTranslation } from 'react-i18next';

const debugLogging = false;
const logDebugConsole = getDebugLogger('TypesCard', debugLogging);

const getColumns = (): IColumn[] => [
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
        name: 'Source property name',
        minWidth: 100,
        fieldName: 'sourcePropId'
    },
    {
        key: 'friendly-name-column',
        name: 'Friendly name',
        minWidth: 200,
        fieldName: 'friendlyName'
    }
];

const TypesCard: React.FC<ITypesCardProps> = (props) => {
    const { typeId } = props;
    // contexts

    // state

    // hooks
    const { getTypeById, updateType } = useTypes();
    const type = useMemo(() => getTypeById(typeId), [getTypeById, typeId]);
    const { getEntityStateCount } = useEntities();
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

    const entityCount = getEntityStateCount(type.id);

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
                    {t('legionApp.modifyStep.existingEntities', {
                        entityCount: entityCount.existing
                    })}
                </i>
                <i>
                    {t('legionApp.modifyStep.discoveredEntities', {
                        entityCount: entityCount.discovered
                    })}
                </i>
                <i>
                    {t('legionApp.modifyStep.deletedEntities', {
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
