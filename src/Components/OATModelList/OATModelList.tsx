import React, { useEffect, useRef, useState } from 'react';
import { useTheme, List, ActionButton, Icon, TextField } from '@fluentui/react';
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
};

const OATModelList = ({ elements, dispatch }: OATModelListProps) => {
    const theme = useTheme();
    const modelsStyles = getModelsStyles();
    const [nameEditor, setNameEditor] = useState(false);
    const [nameText, setNameText] = useState('');
    const [items, setItems] = useState([]);
    const [idEditor, setIdEditor] = useState(false);
    const [idText, setIdText] = useState('');
    const currentNodeId = useRef('');
    const iconStyles = getModelsIconStyles();
    const actionButtonStyles = getModelsActionButtonStyles();

    useEffect(() => {
        setItems(elements);
    }, [elements]);

    useEffect(() => {
        setItems([...elements]);
    }, [theme]);

    const onSelectedClick = (id) => {
        dispatch({
            type: SET_OAT_SELECTED_MODEL_ID,
            payload: id
        });
        currentNodeId.current = id;
    };

    const onNameChange = (evt) => {
        setNameText(evt.target.value);
        setItems([...items]);
    };

    const onNameClick = (name) => {
        setNameText(name);
        setNameEditor(true);
        setItems([...items]);
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
        setIdText(id);
        setIdEditor(true);
        setItems([...items]);
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
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_MODEL,
            payload: null
        });
        dispatch({
            type: SET_OAT_DELETED_MODEL_ID,
            payload: id
        });
        event.stopPropagation();
    };

    const onRenderCell = (item) => {
        return (
            <>
                <ActionButton
                    className={modelsStyles.nodeCancel}
                    onClick={() => onModelDelete(item['@id'])}
                >
                    <Icon iconName="Cancel" styles={iconStyles} />
                </ActionButton>
                <ActionButton
                    styles={actionButtonStyles}
                    onClick={() => onSelectedClick(item['@id'])}
                >
                    <div className={modelsStyles.modelList}>
                        <div
                            onDoubleClick={() =>
                                onNameClick(item['displayName'])
                            }
                        >
                            {(!nameEditor ||
                                currentNodeId.current !== item['@id']) && (
                                <strong>
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
            </>
        );
    };

    return (
        <div className={modelsStyles.container}>
            <List items={items} onRenderCell={onRenderCell} />
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
