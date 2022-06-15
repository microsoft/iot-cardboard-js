import React, { useEffect, useRef, useState } from 'react';
import { useTheme, List, ActionButton, Icon, TextField } from '@fluentui/react';
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
    SET_OAT_PROPERTY_EDITOR_MODEL
} from '../../Models/Constants/ActionTypes';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import OATTextFieldDisplayName from '../../Pages/OATEditorPage/Internal/Components/OATTextFieldDisplayName';
import OATTextFieldId from '../../Pages/OATEditorPage/Internal/Components/OATTextFieldId';

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

    const onSelectedClick = (id) => {
        if (!modified) {
            dispatch({
                type: SET_OAT_SELECTED_MODEL_ID,
                payload: id
            });
            currentNodeId.current = id;
        }
    };

    const onNameClick = (name) => {
        if (!modified) {
            setNameText(name);
            setNameEditor(true);
            setItems([...items]);
        }
    };

    const onIdClick = (id) => {
        if (!modified) {
            setIdText(id);
            setIdEditor(true);
            setItems([...items]);
        }
    };

    const onModelDelete = (id) => {
        if (!modified) {
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: null
            });
            dispatch({
                type: SET_OAT_DELETED_MODEL_ID,
                payload: id
            });
        }
    };

    const onFilterChange = (evt) => {
        setFilter(evt.target.value);
    };

    const onRenderCell = (item) => {
        return (
            <div className={modelsStyles.modelNode}>
                <ActionButton
                    styles={actionButtonStyles}
                    onClick={() => onSelectedClick(item['@id'])}
                >
                    <div>
                        <div onDoubleClick={() => onIdClick(item['@id'])}>
                            {(!idEditor ||
                                currentNodeId.current !== item['@id']) && (
                                <strong className={modelsStyles.strongText}>
                                    {item['@id']}
                                </strong>
                            )}
                            {idEditor && currentNodeId.current === item['@id'] && (
                                <OATTextFieldId
                                    id={idText}
                                    setId={setIdText}
                                    dispatch={dispatch}
                                    state={state}
                                    onChangeCallback={() => {
                                        setItems([...items]);
                                    }}
                                    onCommitCallback={() => {
                                        setIdEditor(false);
                                    }}
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
                                <span className={modelsStyles.regularText}>
                                    {typeof item['displayName'] === 'string'
                                        ? item['displayName']
                                        : Object.values(item['displayName'])[0]}
                                </span>
                            )}
                            {nameEditor &&
                                currentNodeId.current === item['@id'] && (
                                    <OATTextFieldDisplayName
                                        displayName={nameText}
                                        setDisplayName={setNameText}
                                        dispatch={dispatch}
                                        state={state}
                                        onChangeCallback={() => {
                                            setItems([...items]);
                                        }}
                                        onCommitCallback={() => {
                                            setNameEditor(false);
                                        }}
                                        autoFocus
                                    />
                                )}
                        </div>
                    </div>
                </ActionButton>
                <ActionButton
                    className={modelsStyles.nodeCancel}
                    onClick={() => onModelDelete(item['@id'])}
                >
                    <Icon iconName="Cancel" styles={iconStyles} />
                </ActionButton>
            </div>
        );
    };

    return (
        <div>
            <TextField
                className={modelsStyles.searchText}
                onChange={onFilterChange}
                value={filter}
                placeholder={t('search')}
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
