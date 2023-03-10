import React, {
    useEffect,
    useState,
    useContext,
    useRef,
    useCallback
} from 'react';
import {
    classNamesFunction,
    IButtonProps,
    IContextualMenuItem,
    IList,
    SearchBox,
    Stack,
    styled
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import EmptyClipboard from '../../Resources/Static/emptyClipboard.svg';
import { getStyles } from './OATModelList.styles';
import { CommandHistoryContext } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { DtdlInterface } from '../../Models/Constants/dtdlInterfaces';
import { useOatPageContext } from '../../Models/Context/OatPageContext/OatPageContext';
import {
    IOatPageContextState,
    OatPageContextAction,
    OatPageContextActionType
} from '../../Models/Context/OatPageContext/OatPageContext.types';
import { CardboardList } from '../CardboardList';
import { ICardboardListItem } from '../CardboardList/CardboardList.types';
import { getDebugLogger } from '../../Models/Services/Utils';
import {
    IOATModelListStyleProps,
    IOATModelListStyles,
    IOATModelListProps
} from './OATModelList.types';
import { useExtendedTheme } from '../../Models/Hooks/useExtendedTheme';
import { TFunction } from 'i18next';
import { parseModelId } from '../../Models/Services/OatUtils';
import IllustrationMessage from '../IllustrationMessage/IllustrationMessage';
import useTelemetry from '../../Models/Hooks/useTelemetry';
import { TelemetryTrigger } from '../../Models/Constants/TelemetryConstants';
import {
    AppRegion,
    ComponentName,
    TelemetryEvents
} from '../../Models/Constants/OatTelemetryConstants';

const debugLogging = false;
const logDebugConsole = getDebugLogger('OatModelList', debugLogging);

const LIST_ITEM_HEIGHT = 53;

const getClassNames = classNamesFunction<
    IOATModelListStyleProps,
    IOATModelListStyles
>();

const OATModelList: React.FC<IOATModelListProps> = (props) => {
    const { styles } = props;

    // hooks
    const { t } = useTranslation();
    const { sendEventTelemetry } = useTelemetry();

    // contexts
    const { execute } = useContext(CommandHistoryContext);
    const { oatPageState, oatPageDispatch } = useOatPageContext();

    // styles
    const classNames = getClassNames(styles, { theme: useExtendedTheme() });

    // state
    const listRef = useRef<IList>();
    const [filter, setFilter] = useState('');
    const [listItems, setListItems] = useState<
        ICardboardListItem<DtdlInterface>[]
    >(
        getListItems(
            oatPageDispatch,
            oatPageState,
            t,
            execute,
            filter,
            classNames
        )
    );

    // callbacks
    const sendSearchTelemetry = useCallback(() => {
        sendEventTelemetry({
            name: TelemetryEvents.modelSearch,
            triggerType: TelemetryTrigger.UserAction,
            appRegion: AppRegion.OAT,
            componentName: ComponentName.OAT
        });
    }, [sendEventTelemetry]);

    // update the list items anytime a new model is added to the context
    useEffect(() => {
        const items = getListItems(
            oatPageDispatch,
            oatPageState,
            t,
            execute,
            filter,
            classNames
        );
        setListItems(items);
    }, [
        classNames,
        execute,
        filter,
        oatPageDispatch,
        oatPageState,
        oatPageState.currentOntologyModelPositions,
        oatPageState.currentOntologyModels,
        oatPageState.selection,
        t
    ]);

    // scroll to the item when it's selected from the graph side
    const index = listItems.findIndex(
        (x) => x.item['@id'] === oatPageState.selection?.modelId
    );
    useEffect(() => {
        if (index > -1) {
            logDebugConsole(
                'debug',
                'Scrolling to selected item. {index, item}',
                index,
                oatPageState.selection?.modelId
            );
            listRef.current.scrollToIndex(index, () => LIST_ITEM_HEIGHT);
        }
    }, [index, oatPageState.selection]);

    // data
    const illustrationCtaButtonProps: IButtonProps = {
        text: t('OAT.ModelList.noModelsButtonText'),
        onClick: () => {
            oatPageDispatch({
                type: OatPageContextActionType.ADD_NEW_MODEL
            });
        },
        split: true,
        menuProps: {
            items: [
                {
                    key: 'add',
                    text: t('OATHeader.newModel'),
                    onClick: () => {
                        oatPageDispatch({
                            type: OatPageContextActionType.ADD_NEW_MODEL
                        });
                    }
                },
                {
                    key: 'importFile',
                    text: t('OATHeader.importFile'),
                    onClick: oatPageState.openUploadFileCallback
                },
                {
                    key: 'importFolder',
                    text: t('OATHeader.importFolder'),
                    onClick: oatPageState.openUploadFolderCallback
                }
            ]
        }
    };

    const listHasItems = listItems.length > 0;
    const isFiltered = filter?.length !== 0;

    return (
        <Stack
            className={classNames.root}
            tokens={{ childrenGap: 8 }}
            styles={classNames.subComponentStyles.rootStack}
        >
            {!listHasItems && !isFiltered ? (
                <IllustrationMessage
                    type={'info'}
                    width={'wide'}
                    headerText={t('OAT.ModelList.noModelsTitle')}
                    descriptionText={t('OAT.ModelList.noModelsMessage')}
                    imageProps={{
                        height: 100,
                        src: EmptyClipboard
                    }}
                    buttonProps={illustrationCtaButtonProps}
                    styles={classNames.subComponentStyles?.noDataIllustration?.()}
                />
            ) : (
                <SearchBox
                    placeholder={t('OAT.ModelList.searchModels')}
                    onChange={(_, value) => {
                        setFilter(value);
                        sendSearchTelemetry();
                    }}
                    styles={classNames.subComponentStyles.searchbox}
                    data-testid={'models-list-search-box'}
                />
            )}
            {!listHasItems && isFiltered && (
                <div className={classNames.noDataMessage}>
                    {t('OAT.ModelList.noMatchingItemsMessage')}
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

function getListItems(
    oatPageDispatch: React.Dispatch<OatPageContextAction>,
    oatPageState: IOatPageContextState,
    t: TFunction,
    execute: (doFn: () => void, undoFn: () => void) => void,
    filter: string,
    classNames
) {
    const onModelSelected = (id: string) => {
        oatPageDispatch({
            type: OatPageContextActionType.SET_OAT_SELECTED_MODEL,
            payload: { selection: { modelId: id } }
        });
    };

    const getDisplayNameText = (item: DtdlInterface) => {
        return (
            parseModelId(item['@id'])?.name ??
            t('OATPropertyEditor.displayName')
        );
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
                type: OatPageContextActionType.GENERAL_UNDO,
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
                    text: t('OAT.ModelList.removeModelButtonText'),
                    onClick: () => {
                        onModelDelete(model);
                    }
                }
            ];
        };
        const isSelected = x['@id'] === oatPageState.selection?.modelId;
        const item: ICardboardListItem<DtdlInterface> = {
            ariaLabel: getDisplayNameText(x),
            buttonProps: {
                customStyles: classNames.subComponentStyles.listItem?.({
                    isSelected
                })
            },
            isSelected: isSelected,
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
        'Building model list items. {filteredModels, items}',
        models,
        items
    );
    return items;
}
