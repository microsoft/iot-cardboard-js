import React, { useEffect, useRef, useState } from 'react';
import { useTheme, List, ActionButton, Icon, TextField } from '@fluentui/react';
import BaseComponent from '../BaseComponent/BaseComponent';
import {
    getModelsStyles,
    getModelsIconStyles,
    getModelsActionButtonStyles
} from './OATModelList.styles';
import { IOATTwinModelNodes } from '../../Models/Constants';

type OATModelListProps = {
    elements: IOATTwinModelNodes[];
    onDeleteModel: (modelId: string) => any;
    onSelectedModel: (modelId: string) => any;
    onEditedName: (modelId: string) => any;
    onEditedId: (modelId: string) => any;
};

const OATModelList = ({
    elements,
    onDeleteModel,
    onSelectedModel,
    onEditedName,
    onEditedId
}: OATModelListProps) => {
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

    const onSelectedClick = (id) => {
        onSelectedModel(id);
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
        onEditedName(nameText);
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
        onEditedId(idText);
        currentNodeId.current = idText;
        setItems([...items]);
    };

    const onRenderCell = (item) => {
        return (
            <ActionButton
                styles={actionButtonStyles}
                onClick={() => onSelectedClick(item['@id'])}
            >
                <div className={modelsStyles.modelList}>
                    <ActionButton
                        className={modelsStyles.nodeCancel}
                        onClick={() => onDeleteModel(item['@id'])}
                    >
                        <Icon iconName="Cancel" styles={iconStyles} />
                    </ActionButton>
                    <div onClick={() => onNameClick(item['displayName'])}>
                        {(!nameEditor ||
                            currentNodeId.current !== item['@id']) && (
                            <strong>{item['displayName']}</strong>
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
                    <div onClick={() => onIdClick(item['@id'])}>
                        {(!idEditor ||
                            currentNodeId.current !== item['@id']) && (
                            <>{item['@id']}</>
                        )}
                        {idEditor && currentNodeId.current === item['@id'] && (
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
        );
    };

    return (
        <BaseComponent theme={theme}>
            <div>
                <List items={items} onRenderCell={onRenderCell} />
            </div>
        </BaseComponent>
    );
};

OATModelList.defaultProps = {
    elements: [],
    onDeleteModel: () => null,
    onSelectedModel: () => null,
    onEditedName: () => null,
    onEditedId: () => null
};

export default OATModelList;
