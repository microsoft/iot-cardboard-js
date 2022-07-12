import React, { useEffect, useRef, useState, useContext } from 'react';
import { useTheme, List, ActionButton, Icon, SearchBox } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import {
    getModelsStyles,
    getModelsIconStyles,
    getModelsActionButtonStyles
} from './OATModelList.styles';
import { IAction, IOATTwinModelNodes } from '../../Models/Constants';
import {
    SET_OAT_DELETED_MODEL_ID,
    SET_OAT_SELECTED_MODEL_ID,
    SET_OAT_CONFIRM_DELETE_OPEN,
    SET_OAT_PROPERTY_EDITOR_MODEL
} from '../../Models/Constants/ActionTypes';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import OATTextFieldDisplayName from '../../Pages/OATEditorPage/Internal/Components/OATTextFieldDisplayName';
import OATTextFieldId from '../../Pages/OATEditorPage/Internal/Components/OATTextFieldId';
import { deepCopy } from '../../Models/Services/Utils';
import {
    getModelPropertyListItemName,
    isDisplayNameDefined
} from '../OATPropertyEditor/Utils';
import { CommandHistoryContext } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';

type OATModelListProps = {
    elements: IOATTwinModelNodes[];
    dispatch: React.Dispatch<React.SetStateAction<IAction>>;
    modified: boolean;
    state?: IOATEditorState;
};

const OATModelList = ({
    elements,
    dispatch,
    modified,
    state
}: OATModelListProps) => {
    const theme = useTheme();
    const { execute } = useContext(CommandHistoryContext);
    const { t } = useTranslation();
    const modelsStyles = getModelsStyles();
    const [nameEditor, setNameEditor] = useState(false);
    const [nameText, setNameText] = useState('');
    const [items, setItems] = useState([]);
    const [idEditor, setIdEditor] = useState(false);
    const [idText, setIdText] = useState('');
    const [filter, setFilter] = useState('');
    const [elementCount, setElementCount] = useState(elements.length);
    const currentNodeId = useRef('');
    const containerRef = useRef(null);
    const iconStyles = getModelsIconStyles();
    const actionButtonStyles = getModelsActionButtonStyles();
    const { model, models, deletedModelId, selectedModelId } = state;

    useEffect(() => {
        setItems(elements);
        if (elements.length > elementCount) {
            containerRef.current?.scrollTo({
                top: containerRef.current?.scrollHeight,
                behavior: 'smooth'
            });
        }
        setElementCount(elements.length);
    }, [elements]);

    useEffect(() => {
        setItems([...elements]);
    }, [theme]);

    useEffect(() => {
        setItems(
            elements.filter(
                (element) =>
                    !filter ||
                    element['@id'].includes(filter) ||
                    element.displayName.includes(filter)
            )
        );
    }, [filter]);

    useEffect(() => {
        if (model) {
            currentNodeId.current = model['@id'];
            setItems([...elements]);
        } else {
            currentNodeId.current = null;
            setItems([...elements]);
        }
    }, [model]);

    const onSelectedClick = (id: string) => {
        const select = () => {
            dispatch({
                type: SET_OAT_SELECTED_MODEL_ID,
                payload: id
            });
            currentNodeId.current = id;
        };

        const unSelect = () => {
            dispatch({
                type: SET_OAT_SELECTED_MODEL_ID,
                payload: selectedModelId
            });
            currentNodeId.current = selectedModelId;
        };

        if (!modified && id !== selectedModelId) {
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

    const onModelDelete = (id: string) => {
        const deletion = () => {
            const dispatchDelete = () => {
                dispatch({
                    type: SET_OAT_DELETED_MODEL_ID,
                    payload: id
                });
            };
            dispatch({
                type: SET_OAT_CONFIRM_DELETE_OPEN,
                payload: { open: true, callback: dispatchDelete }
            });
        };

        const undoDeletion = () => {
            dispatch({
                type: SET_OAT_DELETED_MODEL_ID,
                payload: deletedModelId
            });
        };

        if (!modified) {
            execute(deletion, undoDeletion);
        }
    };

    const onFilterChange = (evt: Event) => {
        setFilter(evt.target.value);
    };

    const onCommitId = (value) => {
        const commit = () => {
            const modelCopy = deepCopy(model);
            modelCopy['@id'] = value;
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: modelCopy
            });

            setIdText(value);
            setIdEditor(false);
            setItems([...items]);
        };

        const undoCommit = () => {
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: model
            });
        };

        if (value) {
            execute(commit, undoCommit);
        }
    };

    const onCommitDisplayName = (value) => {
        const commit = () => {
            setNameEditor(false);
            setItems([...items]);

            const modelCopy = deepCopy(model);
            modelCopy.displayName = value;
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: modelCopy
            });
            setNameText(value);
        };

        const undoCommit = () => {
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: model
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

    const onRenderCell = (item: IOATTwinModelNodes) => {
        return (
            <div
                className={`${modelsStyles.modelNode} ${
                    currentNodeId.current === item['@id']
                        ? modelsStyles.modelNodeSelected
                        : ''
                } `}
            >
                <ActionButton
                    styles={actionButtonStyles}
                    onClick={() => onSelectedClick(item['@id'])}
                >
                    <div className={modelsStyles.modelNodeButtonContent}>
                        <div onDoubleClick={() => onIdClick(item['@id'])}>
                            {(!idEditor ||
                                currentNodeId.current !== item['@id']) && (
                                <strong className={modelsStyles.strongText}>
                                    {item['@id']}
                                </strong>
                            )}
                            {idEditor && currentNodeId.current === item['@id'] && (
                                <OATTextFieldId
                                    value={idText}
                                    model={model}
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
                                onNameClick(item['displayName'])
                            }
                        >
                            {(!nameEditor ||
                                currentNodeId.current !== item['@id']) && (
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
                            {nameEditor &&
                                currentNodeId.current === item['@id'] && (
                                    <>
                                        <OATTextFieldDisplayName
                                            value={nameText}
                                            model={model}
                                            onChange={() => {
                                                setItems([...items]);
                                            }}
                                            onCommit={onCommitDisplayName}
                                            autoFocus
                                            placeholder={t(
                                                'OATPropertyEditor.displayName'
                                            )}
                                        />
                                    </>
                                )}
                        </div>
                    </div>
                </ActionButton>
                <ActionButton
                    className={modelsStyles.nodeCancel}
                    onClick={() => onModelDelete(item['@id'])}
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
                onChange={onFilterChange}
            />
            <div className={modelsStyles.container} ref={containerRef}>
                <List items={items} onRenderCell={onRenderCell} />
            </div>
        </div>
    );
};

OATModelList.defaultProps = {
    elements: [],
    onSelectedModel: () => null,
    onEditedName: () => null,
    onEditedId: () => null
};

export default OATModelList;
