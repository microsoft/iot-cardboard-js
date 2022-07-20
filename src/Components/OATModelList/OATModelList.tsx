import React, { useEffect, useRef, useState, useContext } from 'react';
import { useTheme, List, ActionButton, Icon, SearchBox } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import {
    getModelsStyles,
    getModelsIconStyles,
    getModelsActionButtonStyles
} from './OATModelList.styles';
import {
    SET_OAT_CONFIRM_DELETE_OPEN,
    SET_OAT_SELECTED_MODEL,
    SET_OAT_MODELS,
    SET_OAT_MODELS_POSITIONS
} from '../../Models/Constants/ActionTypes';
import OATTextFieldDisplayName from '../../Pages/OATEditorPage/Internal/Components/OATTextFieldDisplayName';
import OATTextFieldId from '../../Pages/OATEditorPage/Internal/Components/OATTextFieldId';
import {
    deepCopy,
    deleteModelFromCollection,
    getNewModelNewModelsAndNewPositionsFromId
} from '../../Models/Services/Utils';
import {
    getModelPropertyListItemName,
    isDisplayNameDefined
} from '../OATPropertyEditor/Utils';
import { CommandHistoryContext } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { OATModelListProps } from './OATModelList.types';
import { DtdlInterface } from '../../Models/Constants/dtdlInterfaces';

const OATModelList = ({ dispatch, state }: OATModelListProps) => {
    const theme = useTheme();
    const { execute } = useContext(CommandHistoryContext);
    const { t } = useTranslation();
    const { model, models, modified, modelPositions } = state;
    const modelsStyles = getModelsStyles();
    const [nameEditor, setNameEditor] = useState(false);
    const [nameText, setNameText] = useState('');
    const [items, setItems] = useState([]);
    const [idEditor, setIdEditor] = useState(false);
    const [idText, setIdText] = useState('');
    const [filter, setFilter] = useState('');
    const [elementCount, setElementCount] = useState(models.length);
    const containerRef = useRef(null);
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
    }, [model]);

    const getModelFromId = (id) => {
        // Find the model with the given id
        return models.find((element) => element['@id'] === id);
    };

    const onSelectedClick = (id: string) => {
        const selectedModel = getModelFromId(id);
        const select = () => {
            dispatch({
                type: SET_OAT_SELECTED_MODEL,
                payload: selectedModel
            });
        };

        const unSelect = () => {
            dispatch({
                type: SET_OAT_SELECTED_MODEL,
                payload: model
            });
        };

        if (!model || (model && id !== model['@id'])) {
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
                const newModels = deleteModelFromCollection(
                    item['@id'],
                    item,
                    models
                );
                dispatch({
                    type: SET_OAT_MODELS,
                    payload: newModels
                });
                // Dispatch selected model to null
                dispatch({
                    type: SET_OAT_SELECTED_MODEL,
                    payload: null
                });
            };
            dispatch({
                type: SET_OAT_CONFIRM_DELETE_OPEN,
                payload: { open: true, callback: dispatchDelete }
            });
        };

        const undoDeletion = () => {
            dispatch({
                type: SET_OAT_MODELS,
                payload: models
            });
            dispatch({
                type: SET_OAT_SELECTED_MODEL,
                payload: model
            });
        };

        if (!modified) {
            execute(deletion, undoDeletion);
        }
    };

    const onCommitId = (value) => {
        const commit = () => {
            const modelData = getNewModelNewModelsAndNewPositionsFromId(
                value,
                model,
                models,
                modelPositions
            );

            dispatch({
                type: SET_OAT_MODELS_POSITIONS,
                payload: modelData.positions
            });
            dispatch({
                type: SET_OAT_MODELS,
                payload: modelData.models
            });
            dispatch({
                type: SET_OAT_SELECTED_MODEL,
                payload: modelData.model
            });

            setIdText(value);
            setIdEditor(false);
            setItems([...items]);
        };

        const undoCommit = () => {
            dispatch({
                type: SET_OAT_SELECTED_MODEL,
                payload: model
            });
            dispatch({
                type: SET_OAT_MODELS,
                payload: models
            });
            dispatch({
                type: SET_OAT_MODELS_POSITIONS,
                payload: modelPositions
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
                (item) => item['@id'] === model['@id']
            );
            if (modelCopy) {
                modelCopy.displayName = value;
                dispatch({
                    type: SET_OAT_MODELS,
                    payload: modelsCopy
                });
            }

            setNameText(value);
            setNameEditor(false);
            setItems([...items]);
        };

        const undoCommit = () => {
            dispatch({
                type: SET_OAT_MODELS,
                payload: models
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
        const isSelected = model && model['@id'] === item['@id'];
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
