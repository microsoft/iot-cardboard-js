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
    SET_OAT_EDITED_MODEL_NAME,
    SET_OAT_EDITED_MODEL_ID,
    SET_OAT_PROPERTY_EDITOR_MODEL
} from '../../Models/Constants/ActionTypes';

type OATModelListProps = {
    elements: IOATTwinModelNodes[];
    dispatch: React.Dispatch<React.SetStateAction<IAction>>;
    modified: boolean;
};

const OATModelList = ({ elements, dispatch, modified }: OATModelListProps) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const modelsStyles = getModelsStyles();
    const [nameEditor, setNameEditor] = useState(false);
    const [nameText, setNameText] = useState('');
    const [items, setItems] = useState([]);
    const [idEditor, setIdEditor] = useState(false);
    const [idText, setIdText] = useState('');
    const [filter, setFilter] = useState('');
    const currentNodeId = useRef('');
    const iconStyles = getModelsIconStyles();
    const actionButtonStyles = getModelsActionButtonStyles();

    useEffect(() => {
        setItems(elements);
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

    const onNameChange = (evt) => {
        setNameText(evt.target.value);
        setItems([...items]);
    };

    const onNameClick = (name) => {
        if (!modified) {
            setNameText(name);
            setNameEditor(true);
            setItems([...items]);
        }
    };

    const onNameBlur = () => {
        setNameEditor(false);
        dispatch({
            type: SET_OAT_EDITED_MODEL_NAME,
            payload: nameText
        });
        setItems([...items]);
    };

    const onIdChange = (evt) => {
        setIdText(evt.target.value);
        setItems([...items]);
    };

    const onIdClick = (id) => {
        if (!modified) {
            setIdText(id);
            setIdEditor(true);
            setItems([...items]);
        }
    };

    const onIdBlur = () => {
        setIdEditor(false);
        dispatch({
            type: SET_OAT_EDITED_MODEL_ID,
            payload: idText
        });
        currentNodeId.current = idText;
        setItems([...items]);
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
                        <div
                            onDoubleClick={() =>
                                onNameClick(item['displayName'])
                            }
                        >
                            {(!nameEditor ||
                                currentNodeId.current !== item['@id']) && (
                                <strong className={modelsStyles.strongText}>
                                    {typeof item['displayName'] === 'string'
                                        ? item['displayName']
                                        : Object.values(item['displayName'])[0]}
                                </strong>
                            )}
                            {nameEditor &&
                                currentNodeId.current === item['@id'] && (
                                    <TextField
                                        id="text"
                                        name="text"
                                        onChange={onNameChange}
                                        value={nameText}
                                        onBlur={onNameBlur}
                                        autoFocus
                                    />
                                )}
                        </div>
                        <div onDoubleClick={() => onIdClick(item['@id'])}>
                            {(!idEditor ||
                                currentNodeId.current !== item['@id']) && (
                                <>{item['@id']}</>
                            )}
                            {idEditor &&
                                currentNodeId.current === item['@id'] && (
                                    <TextField
                                        id="text"
                                        name="text"
                                        onChange={onIdChange}
                                        value={idText}
                                        onBlur={onIdBlur}
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
            <div className={modelsStyles.container}>
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
