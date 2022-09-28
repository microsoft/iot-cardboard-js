import React, { useEffect, useRef, useState, useContext } from 'react';
import { useTheme, List, ActionButton, Icon, SearchBox } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import {
    getModelsStyles,
    getModelsIconStyles,
    getModelsActionButtonStyles
} from './OATModelList.styles';
import OATTextFieldDisplayName from '../../Pages/OATEditorPage/Internal/Components/OATTextFieldDisplayName';
import OATTextFieldId from '../../Pages/OATEditorPage/Internal/Components/OATTextFieldId';
import { deleteOatModel, updateModelId } from '../../Models/Services/OatUtils';
import { deepCopy } from '../../Models/Services/Utils';
import {
    getModelPropertyListItemName,
    isDisplayNameDefined
} from '../OATPropertyEditor/Utils';
import { CommandHistoryContext } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { DtdlInterface } from '../../Models/Constants/dtdlInterfaces';
import { useOatPageContext } from '../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../Models/Context/OatPageContext/OatPageContext.types';

const OATModelList = () => {
    // contexts
    const { execute } = useContext(CommandHistoryContext);
    const { oatPageState, oatPageDispatch } = useOatPageContext();
    const { selection, models, modified, modelPositions } = oatPageState;

    // state
    const [nameEditor, setNameEditor] = useState(false);
    const [nameText, setNameText] = useState('');
    const [items, setItems] = useState([]);
    const [idEditor, setIdEditor] = useState(false);
    const [idText, setIdText] = useState('');
    const [filter, setFilter] = useState('');
    const [elementCount, setElementCount] = useState(models.length);
    const containerRef = useRef(null);

    // hooks
    const theme = useTheme();
    const { t } = useTranslation();

    // styles
    const modelsStyles = getModelsStyles();
    const iconStyles = getModelsIconStyles();
    const actionButtonStyles = getModelsActionButtonStyles();

    useEffect(() => {
        setItems(models);
        if (models.length > elementCount) {
            containerRef.current?.scrollTo({
                top: containerRef.current?.scrollHeight,
                behavior: 'smooth'
            });
        }
        setElementCount(models.length);
    }, [models]);

    useEffect(() => {
        setItems([...models]);
    }, [theme]);

    useEffect(() => {
        setItems(
            models.filter(
                (element) =>
                    !filter ||
                    element['@id'].includes(filter) ||
                    element.displayName.includes(filter)
            )
        );
    }, [filter]);

    useEffect(() => {
        // Set models, so that modelList items re-render and apply style changes if necessary
        setItems([...models]);
    }, [selection]);

    const onSelectedClick = (id: string) => {
        const select = () => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_SELECTED_MODEL,
                payload: { selection: { modelId: id } }
            });
        };

        const unSelect = () => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_SELECTED_MODEL,
                payload: { selection: selection }
            });
        };

        if (!selection || (selection && id !== selection.modelId)) {
            execute(select, unSelect);
        }
    };

    const onNameClick = (name: string) => {
        if (!modified) {
            setNameText(name);
            setNameEditor(true);
            setItems([...items]);
        }
    };

    const onIdClick = (id: string) => {
        if (!modified) {
            setIdText(id);
            setIdEditor(true);
            setItems([...items]);
        }
    };

    const onModelDelete = (item: DtdlInterface) => {
        const deletion = () => {
            const dispatchDelete = () => {
                // Remove the model from the list
                const newModels = deleteOatModel(item['@id'], item, models);
                oatPageDispatch({
                    type: OatPageContextActionType.SET_OAT_MODELS,
                    payload: newModels
                });
                // Dispatch selected model to null
                oatPageDispatch({
                    type: OatPageContextActionType.SET_OAT_SELECTED_MODEL,
                    payload: null
                });
            };
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_CONFIRM_DELETE_OPEN,
                payload: { open: true, callback: dispatchDelete }
            });
        };

        const undoDeletion = () => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_MODELS,
                payload: { models }
            });
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_SELECTED_MODEL,
                payload: { selection }
            });
        };

        if (!modified) {
            execute(deletion, undoDeletion);
        }
    };

    const onCommitId = (value) => {
        const commit = () => {
            const {
                models: modelsCopy,
                positions: modelPositionsCopy
            } = updateModelId(selection.modelId, value, models, modelPositions);

            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_MODELS_POSITIONS,
                payload: { positions: modelPositionsCopy }
            });
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_MODELS,
                payload: { models: modelsCopy as DtdlInterface[] }
            });
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_SELECTED_MODEL,
                payload: { selection: { modelId: value } }
            });

            setIdText(value);
            setIdEditor(false);
            setItems([...items]);
        };

        const undoCommit = () => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_MODELS_POSITIONS,
                payload: { positions: modelPositions }
            });
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_MODELS,
                payload: { models: models }
            });
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_SELECTED_MODEL,
                payload: { selection }
            });
        };

        if (value) {
            execute(commit, undoCommit);
        }
    };

    const onCommitDisplayName = (value) => {
        const commit = () => {
            const modelsCopy = deepCopy(models);
            const modelCopy = modelsCopy.find(
                (item) => item['@id'] === selection.modelId
            );
            if (modelCopy) {
                modelCopy.displayName = value;
                oatPageDispatch({
                    type: OatPageContextActionType.SET_OAT_MODELS,
                    payload: { models: modelsCopy }
                });
            }

            setNameText(value);
            setNameEditor(false);
            setItems([...items]);
        };

        const undoCommit = () => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_MODELS,
                payload: { models: models }
            });
        };

        execute(commit, undoCommit);
    };

    const getDisplayNameText = (item) => {
        const displayName = getModelPropertyListItemName(item.displayName);
        return displayName.length > 0
            ? displayName
            : t('OATPropertyEditor.displayName');
    };

    const onRenderCell = (item: DtdlInterface) => {
        const isSelected =
            selection &&
            selection.modelId === item['@id'] &&
            !selection.contentId;
        return (
            <div
                className={`${modelsStyles.modelNode} ${
                    isSelected ? modelsStyles.modelNodeSelected : ''
                }`}
            >
                <ActionButton
                    styles={actionButtonStyles}
                    onClick={() => onSelectedClick(item['@id'])}
                >
                    <div className={modelsStyles.modelNodeButtonContent}>
                        <div onDoubleClick={() => onIdClick(item['@id'])}>
                            {(!idEditor || !isSelected) && (
                                <strong className={modelsStyles.strongText}>
                                    {item['@id']}
                                </strong>
                            )}
                            {idEditor && isSelected && (
                                <OATTextFieldId
                                    value={idText}
                                    model={item}
                                    models={models}
                                    onChange={() => {
                                        setItems([...items]);
                                    }}
                                    onCommit={onCommitId}
                                    autoFocus
                                />
                            )}
                        </div>
                        <div
                            onDoubleClick={() =>
                                onNameClick(
                                    getModelPropertyListItemName(
                                        item['displayName']
                                    )
                                )
                            }
                        >
                            {(!nameEditor || !isSelected) && (
                                <span
                                    className={
                                        isDisplayNameDefined(item.displayName)
                                            ? modelsStyles.regularText
                                            : modelsStyles.placeholderText
                                    }
                                >
                                    {getDisplayNameText(item)}
                                </span>
                            )}
                            {nameEditor && isSelected && (
                                <OATTextFieldDisplayName
                                    value={nameText}
                                    model={item}
                                    onChange={() => {
                                        setItems([...items]);
                                    }}
                                    onCommit={onCommitDisplayName}
                                    autoFocus
                                    placeholder={t(
                                        'OATPropertyEditor.displayName'
                                    )}
                                />
                            )}
                        </div>
                    </div>
                </ActionButton>
                <ActionButton
                    className={modelsStyles.nodeCancel}
                    onClick={() => onModelDelete(item)}
                >
                    <Icon iconName="Delete" styles={iconStyles} />
                </ActionButton>
            </div>
        );
    };

    return (
        <div>
            <SearchBox
                className={modelsStyles.searchText}
                placeholder={t('search')}
                onChange={(_, value) => setFilter(value)}
            />
            <div className={modelsStyles.container} ref={containerRef}>
                <List items={items} onRenderCell={onRenderCell} />
            </div>
        </div>
    );
};

export default OATModelList;
