import React, { useEffect, useState, useContext } from 'react';
import {
    classNamesFunction,
    IContextualMenuItem,
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

const debugLogging = true;
const logDebugConsole = getDebugLogger('OatModelList', debugLogging);

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

    // styles
    const classNames = getClassNames(styles, { theme: useTheme() });

    return (
        <Stack
            className={classNames.root}
            tokens={{ childrenGap: 8 }}
            styles={classNames.subComponentStyles.rootStack}
        >
            <SearchBox
                placeholder={t('search')}
                onChange={(_, value) => setFilter(value)}
                styles={classNames.subComponentStyles.searchbox}
            />
            <CardboardList
                className={classNames.listContainer}
                items={listItems}
                listKey={'model-list'}
            />
        </Stack>
    );
};

export default styled<
    IOATModelListProps,
    IOATModelListStyleProps,
    IOATModelListStyles
>(OATModelList, getStyles);
