import React, { useEffect, useRef, useState, useContext } from 'react';
import { SearchBox } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getModelsStyles } from './OATModelList.styles';
import { getModelPropertyListItemName } from '../OATPropertyEditor/Utils';
import { CommandHistoryContext } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { DtdlInterface } from '../../Models/Constants/dtdlInterfaces';
import { useOatPageContext } from '../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../Models/Context/OatPageContext/OatPageContext.types';
import { CardboardList } from '../CardboardList';
import { ICardboardListItem } from '../CardboardList/CardboardList.types';
import { getDebugLogger } from '../../Models/Services/Utils';

const debugLogging = true;
const logDebugConsole = getDebugLogger('OatModelList', debugLogging);

const OATModelList: React.FC = () => {
    // hooks
    const { t } = useTranslation();

    // contexts
    const { execute } = useContext(CommandHistoryContext);
    const { oatPageState, oatPageDispatch } = useOatPageContext();

    // state
    const [listItems, setListItems] = useState<
        ICardboardListItem<DtdlInterface>[]
    >([]);
    const [filter, setFilter] = useState('');
    const containerRef = useRef(null);

    useEffect(() => {
        const onModelSelected = (id: string) => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_SELECTED_MODEL,
                payload: { selection: { modelId: id } }
            });
        };

        const getDisplayNameText = (item: DtdlInterface) => {
            const displayName = getModelPropertyListItemName(item.displayName);
            return displayName.length > 0
                ? displayName
                : t('OATPropertyEditor.displayName');
        };

        const onModelDelete = (item: DtdlInterface) => {
            const deletion = () => {
                const dispatchDelete = () => {
                    oatPageDispatch({
                        type: OatPageContextActionType.DELETE_MODEL,
                        payload: { id: item['@id'] }
                    });
                };
                oatPageDispatch({
                    type: OatPageContextActionType.SET_OAT_CONFIRM_DELETE_OPEN,
                    payload: { open: true, callback: dispatchDelete }
                });
            };

            const undoDeletion = () => {
                oatPageDispatch({
                    type: OatPageContextActionType.DELETE_MODEL_UNDO,
                    payload: {
                        models: oatPageState.currentOntologyModels,
                        positions: oatPageState.currentOntologyModelPositions,
                        selection: oatPageState.selection
                    }
                });
            };

            execute(deletion, undoDeletion);
        };

        const models = oatPageState.currentOntologyModels.filter((model) => {
            return (
                !filter.trim() ||
                getDisplayNameText(model)
                    .toLowerCase()
                    .includes(filter.trim().toLowerCase())
            );
        });
        const items = models.map((x) => {
            const item: ICardboardListItem<DtdlInterface> = {
                item: x,
                ariaLabel: '',
                textPrimary: getDisplayNameText(x),
                textSecondary: x['@id'],
                onClick: () => onModelSelected(x['@id']),
                iconEnd: {
                    name: 'Delete',
                    onClick: () => onModelDelete(x)
                }
            };
            return item;
        });
        logDebugConsole(
            'debug',
            'Setting model list items. {filteredModels, items}',
            models,
            items
        );
        setListItems(items);
    }, [
        execute,
        filter,
        oatPageDispatch,
        oatPageState.currentOntologyModelPositions,
        oatPageState.currentOntologyModels,
        oatPageState.selection,
        t
    ]);

    // styles
    const modelsStyles = getModelsStyles();

    return (
        <div>
            <SearchBox
                className={modelsStyles.searchText}
                placeholder={t('search')}
                onChange={(_, value) => setFilter(value)}
            />
            <div className={modelsStyles.container} ref={containerRef}>
                <CardboardList items={listItems} listKey={'model-list'} />
            </div>
        </div>
    );
};

export default OATModelList;
