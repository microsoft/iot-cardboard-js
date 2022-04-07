import React, { useState, useContext } from 'react';
import { useTheme, Icon, FontSizes, ActionButton } from '@fluentui/react';
import { Handle } from 'react-flow-renderer';
import { useTranslation } from 'react-i18next';
import { IOATGraphCustomNodeProps } from '../../Models/Constants/Interfaces';
import { ElementsContext } from '../OATGraphViewer';

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
    const { elements, setElements, onDeleteNode } = useContext(ElementsContext);

    const onNameChange = (evt) => {
        setNameText(evt.target.value);
    };

    const onNameClick = () => {
        setNameEditor(true);
    };

    const onNameBlur = () => {
        setNameEditor(false);
        if (data.name !== nameText) {
            const index = elements.findIndex(
                (element) => element.id === data.id
            );
            elements[index].data.name = nameText;
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
        if (data.id !== idText) {
            let sourceElements = elements.findIndex(
                (element) => element.source === data.id
            );
            while (sourceElements !== -1) {
                elements[sourceElements].source = idText;
                sourceElements = elements.findIndex(
                    (element) => element.source === data.id
                );
            }
            let targetElements = elements.findIndex(
                (element) => element.target === data.id
            );
            while (targetElements !== -1) {
                elements[targetElements].target = idText;
                targetElements = elements.findIndex(
                    (element) => element.target === data.id
                );
            }
            const index = elements.findIndex(
                (element) => element.id === data.id
            );
            elements[index].data.id = idText;
            elements[index].id = idText;
            setElements([...elements]);
        }
    };

    const onDelete = () => {
        onDeleteNode(data.id);
    };

    return (
        <>
            <Handle
                type="target"
                position="top"
                style={{ background: theme.semanticColors.variantBorder }}
                isConnectable={isConnectable}
            />
            <div className="cb-oat-graph-viewer-node">
                <ActionButton
                    className="cb-oat-graph-viewer-node-cancel"
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
            <Handle
                type="source"
                position="bottom"
                id="Relationship"
                style={{
                    background: theme.semanticColors.variantBorder
                }}
                isConnectable={isConnectable}
            />
        </>
    );
};

export default OATGraphCustomNode;
