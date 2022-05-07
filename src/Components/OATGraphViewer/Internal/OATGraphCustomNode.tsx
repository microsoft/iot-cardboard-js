import React, { useState, useContext } from 'react';
import { useTheme, Icon, FontSizes, ActionButton } from '@fluentui/react';
import { Handle, removeElements } from 'react-flow-renderer';
import { useTranslation } from 'react-i18next';
import { IOATGraphCustomNodeProps } from '../../Models/Constants/Interfaces';
import { getGraphViewerStyles } from '../OATGraphViewer.styles';
import { ElementsContext } from './OATContext';
import {
    OATRelationshipHandleName,
    OATComponentHandleName,
    OATExtendHandleName,
    OATUntargetedRelationshipName
} from '../../../Models/Constants/Constants';
import { SET_OAT_PROPERTY_EDITOR_MODEL } from '../../../Models/Constants/ActionTypes';

const OATGraphCustomNode: React.FC<IOATGraphCustomNodeProps> = ({
    data,
    isConnectable
}) => {
    const { t } = useTranslation();
    const [nameEditor, setNameEditor] = useState(false);
    const [nameText, setNameText] = useState(data.name);
    const [idEditor, setIdEditor] = useState(false);
    const [idText, setIdText] = useState(data.id);
    const theme = useTheme();
    const { elements, setElements, setCurrentNode, dispatch } = useContext(
        ElementsContext
    );
    const graphViewerStyles = getGraphViewerStyles();

    const onNameChange = (evt) => {
        setNameText(evt.target.value);
    };

    const onNameClick = () => {
        setNameText(data.name);
        setNameEditor(true);
    };

    const onNameBlur = () => {
        setNameEditor(false);
        if (data.name !== nameText) {
            elements.find(
                (element) => element.id === data.id
            ).data.name = nameText;
            setElements([...elements]);
            const modelUpdated = {
                '@id': data.id,
                '@type': data.type,
                '@context': data.context,
                displayName: nameText,
                contents: data.content
            };
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: modelUpdated
            });
        }
    };

    const onIdChange = (evt) => {
        setIdText(evt.target.value);
    };

    const onIdClick = () => {
        setIdEditor(true);
    };

    const onIdBlur = () => {
        setIdEditor(false);
        const prevId = data.id;
        if (data.id !== idText) {
            elements
                .filter((x) => x.source === data.id)
                .forEach((x) => (x.source = idText));
            elements
                .filter((x) => x.target === data.id)
                .forEach((x) => (x.target = idText));
            elements.find((element) => element.id === prevId).data.id = idText;
            elements.find((element) => element.id === prevId).id = idText;
            setElements([...elements]);
            const updatedModel = {
                '@id': idText,
                '@type': data.type,
                '@context': data.context,
                displayName: data.name,
                contents: data.content
            };
            setCurrentNode(idText);
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: updatedModel
            });
        }
    };

    const onDelete = () => {
        const elementsToRemove = [
            {
                id: data.id
            }
        ];
        setElements((els) => removeElements(elementsToRemove, els));
        dispatch({ type: SET_OAT_PROPERTY_EDITOR_MODEL, payload: null });
    };

    return (
        <>
            <Handle
                type="target"
                position="top"
                className={graphViewerStyles.handle}
                isConnectable={isConnectable}
            />
            <div className={graphViewerStyles.node}>
                <ActionButton
                    className={graphViewerStyles.nodeCancel}
                    onClick={onDelete}
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
                {data.type !== OATUntargetedRelationshipName && (
                    <>
                        <div>
                            {t('OATGraphViewer.name')}:
                            {!nameEditor && (
                                <strong onClick={onNameClick}>
                                    {data.name}
                                </strong>
                            )}
                            {nameEditor && (
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
                        <div>
                            {t('OATGraphViewer.id')}:
                            {!idEditor && (
                                <strong onClick={onIdClick}>{data.id}</strong>
                            )}
                            {idEditor && (
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
                    </>
                )}
                {data.type === OATUntargetedRelationshipName && (
                    <>
                        <div>
                            <strong>{data.type}</strong>
                        </div>
                    </>
                )}
            </div>
            {data.type === 'Interface' && (
                <>
                    <Handle
                        type="source"
                        position="bottom"
                        id={OATComponentHandleName}
                        className={graphViewerStyles.componentHandle}
                        isConnectable={isConnectable}
                    />
                    <Handle
                        type="source"
                        position="bottom"
                        id={OATRelationshipHandleName}
                        className={graphViewerStyles.relationshipHandle}
                        isConnectable={isConnectable}
                    />
                    <Handle
                        type="source"
                        position="bottom"
                        id={OATExtendHandleName}
                        className={graphViewerStyles.extendHandle}
                        isConnectable={isConnectable}
                    />
                </>
            )}
        </>
    );
};

export default OATGraphCustomNode;
