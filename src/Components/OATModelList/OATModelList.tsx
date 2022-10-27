import React, { useEffect, useState, useContext, useRef } from 'react';
import {
    classNamesFunction,
    IContextualMenuItem,
    IList,
    SearchBox,
    Stack,
    styled,
    useTheme
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getStyles } from './OATModelList.styles';
import { getModelPropertyListItemName } from '../OATPropertyEditor/Utils';
import { CommandHistoryContext } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { DtdlInterface } from '../../Models/Constants/dtdlInterfaces';
import { useOatPageContext } from '../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../Models/Context/OatPageContext/OatPageContext.types';
import { CardboardList } from '../CardboardList';
import { ICardboardListItem } from '../CardboardList/CardboardList.types';
import { getDebugLogger } from '../../Models/Services/Utils';
import {
    IOATModelListStyleProps,
    IOATModelListStyles,
    IOATModelListProps
} from './OATModelList.types';

const debugLogging = false;
const logDebugConsole = getDebugLogger('OatModelList', debugLogging);

const LIST_ITEM_HEIGHT = 51;

const getClassNames = classNamesFunction<
    IOATModelListStyleProps,
    IOATModelListStyles
>();

const OATModelList: React.FC<IOATModelListProps> = (props) => {
    const { styles } = props;

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
    const listRef = useRef<IList>();

    // update the list items anytime a new model is added to the context
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
            const getOverflowMenuItems = (
                model: DtdlInterface
            ): IContextualMenuItem[] => {
                return [
                    {
                        key: 'delete',
                        'data-testid': 'delete-model',
                        iconProps: {
                            iconName: 'Delete'
                        },
                        text: t('OATModelList.removeModelButtonText'),
                        onClick: () => {
                            onModelDelete(model);
                        }
                    }
                ];
            };
            const item: ICardboardListItem<DtdlInterface> = {
                ariaLabel: getDisplayNameText(x),
                isSelected: x['@id'] === oatPageState.selection?.modelId,
                item: x,
                onClick: () => onModelSelected(x['@id']),
                overflowMenuItems: getOverflowMenuItems(x),
                textPrimary: getDisplayNameText(x),
                textSecondary: x['@id']
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

    // scroll to the item when it's selected from the graph side
    useEffect(() => {
        const index = listItems.findIndex(
            (x) => x.item['@id'] === oatPageState.selection?.modelId
        );
        logDebugConsole(
            'debug',
            'Scrolling to selected item. {index, item}',
            index,
            oatPageState.selection?.modelId
        );
        if (index > -1) {
            listRef.current.scrollToIndex(index, () => LIST_ITEM_HEIGHT);
        }
    }, [listItems, oatPageState.selection]);

    // styles
    const classNames = getClassNames(styles, { theme: useTheme() });

    const listHasItems = listItems.length > 0;

    return (
        <Stack
            className={classNames.root}
            tokens={{ childrenGap: 8 }}
            styles={classNames.subComponentStyles.rootStack}
        >
            <SearchBox
                placeholder={t('OATModelList.searchModels')}
                onChange={(_, value) => setFilter(value)}
                styles={classNames.subComponentStyles.searchbox}
                data-testid={'models-list-search-box'}
            />
            {!listHasItems && (
                <div className={classNames.noDataMessage}>
                    {filter?.length
                        ? t('OATModelList.noMatchingItemsMessage')
                        : t('OATModelList.noDataMessage')}
                </div>
            )}
            {listHasItems && (
                <CardboardList
                    className={classNames.listContainer}
                    listProps={{
                        componentRef: listRef
                    }}
                    items={listItems}
                    listKey={'models-list'}
                />
            )}
        </Stack>
    );
};

export default styled<
    IOATModelListProps,
    IOATModelListStyleProps,
    IOATModelListStyles
>(OATModelList, getStyles);
