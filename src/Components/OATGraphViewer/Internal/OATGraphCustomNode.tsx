import React, { memo, useCallback, useState } from 'react';
import { useTheme } from '@fluentui/react';
import { Handle } from 'react-flow-renderer';
import { useTranslation } from 'react-i18next';
import { IOATGraphCustomNodeProps } from '../../Models/Constants/Interfaces';
import { getGraphViewerStyles } from '../OATGraphViewer.styles';

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
    const graphViewerStyles = getGraphViewerStyles();

    const onNameChange = useCallback((evt) => {
        data.name = evt.target.value;
        setNameText(evt.target.value);
    }, []);

    const onNameClick = useCallback(() => {
        setNameEditor(true);
    }, []);

    const onNameBlur = useCallback(() => {
        setNameEditor(false);
    }, []);

    const onIdChange = useCallback((evt) => {
        data.id = evt.target.value;
        setIdText(evt.target.value);
    }, []);

    const onIdClick = useCallback(() => {
        setIdEditor(true);
    }, []);

    const onIdBlur = useCallback(() => {
        setIdEditor(false);
    }, []);

    return (
        <>
            <Handle
                type="target"
                position="top"
                className={graphViewerStyles.handle}
                isConnectable={isConnectable}
            />
            <div className={graphViewerStyles.node}>
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
                className={graphViewerStyles.handle}
                isConnectable={isConnectable}
            />
        </>
    );
};

export default OATGraphCustomNode;
