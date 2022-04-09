import React, { useState, useContext } from 'react';
import { useTheme, Icon, FontSizes, ActionButton } from '@fluentui/react';
import { Handle, removeElements } from 'react-flow-renderer';
import { useTranslation } from 'react-i18next';
import { IOATGraphCustomNodeProps } from '../../Models/Constants/Interfaces';
import { getGraphViewerStyles } from '../OATGraphViewer.styles';
import { ElementsContext } from './OATContext';
import {
    RelationshipHandleName,
    ComponentHandleName,
    ExtendHandleName
} from '../../../Models/Constants/Constants';

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
    const { elements, setElements } = useContext(ElementsContext);
    const graphViewerStyles = getGraphViewerStyles();

    const onNameChange = (evt) => {
        setNameText(evt.target.value);
    };

    const onNameClick = () => {
        setNameEditor(true);
    };

    const onNameBlur = () => {
        setNameEditor(false);
        if (data.name !== nameText) {
            elements.find(
                (element) => element.id === data.id
            ).data.name = nameText;
            setElements([...elements]);
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
        }
    };

    const onDelete = () => {
        const elementsToRemove = [
            {
                id: data.id
            }
        ];
        setElements((els) => removeElements(elementsToRemove, els));
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
                <div>
                    {t('OATGraphViewer.name')}:
                    {!nameEditor && (
                        <strong onClick={onNameClick}>{data.name}</strong>
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
                <div>
                    {t('OATGraphViewer.type')}:<strong>{data.type}</strong>
                </div>
            </div>
            {data.type === 'Interface' && (
                <>
                    <Handle
                        type="source"
                        position="bottom"
                        id={ComponentHandleName}
                        className={graphViewerStyles.componentHandle}
                        isConnectable={isConnectable}
                    />
                    <Handle
                        type="source"
                        position="bottom"
                        id={RelationshipHandleName}
                        className={graphViewerStyles.relationshipHandle}
                        isConnectable={isConnectable}
                    />
                    <Handle
                        type="source"
                        position="bottom"
                        id={ExtendHandleName}
                        className={graphViewerStyles.extendHandle}
                        isConnectable={isConnectable}
                    />
                </>
            )}
        </>
    );
};

export default OATGraphCustomNode;
