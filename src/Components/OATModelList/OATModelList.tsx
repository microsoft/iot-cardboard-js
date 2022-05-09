import React, { useEffect, useRef, useState } from 'react';
import { useTheme, List, ActionButton, Icon, FontSizes } from '@fluentui/react';
import { getModelsStyles } from './OATModelList.styles';
import { IOATTwinModelNodes } from '../../Models/Constants';
import {
    SET_OAT_DELETED_MODEL_ID,
    SET_OAT_SELECTED_MODEL_ID,
    SET_OAT_EDITED_MODEL_NAME,
    SET_OAT_EDITED_MODEL_ID
} from '../../Models/Constants/ActionTypes';

type OATModelListProps = {
    elements: IOATTwinModelNodes[];
    dispatch: any;
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

    const onRenderCell = (item) => {
        return (
            <div data-is-focusable={true}>
                <div
                    onClick={() => onSelectedClick(item['@id'])}
                    className={modelsStyles.modelList}
                >
                    <ActionButton
                        className={modelsStyles.nodeCancel}
                        onClick={() => {
                            dispatch({
                                type: SET_OAT_DELETED_MODEL_ID,
                                payload: item['@id']
                            });
                        }}
                    >
                        <Icon
                            iconName="Cancel"
                            styles={{
                                root: {
                                    fontSize: FontSizes.size10,
                                    color: theme.semanticColors.actionLink
                                }
                            }}
                        />
                    </ActionButton>
                    <div onClick={() => onNameClick(item['displayName'])}>
                        {(!nameEditor ||
                            currentNodeId.current !== item['@id']) && (
                            <strong>{item['displayName']}</strong>
                        )}
                        {nameEditor &&
                            currentNodeId.current === item['@id'] && (
                                <input
                                    id="text"
                                    name="text"
                                    onChange={onNameChange}
                                    value={nameText}
                                    onBlur={onNameBlur}
                                    autoFocus
                                />
                            )}
                    </div>
                    <div onClick={() => onIdClick(item['@id'])}>
                        {(!idEditor ||
                            currentNodeId.current !== item['@id']) && (
                            <>{item['@id']}</>
                        )}
                        {idEditor && currentNodeId.current === item['@id'] && (
                            <input
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
            </div>
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
