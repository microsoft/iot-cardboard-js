import React, { memo, useCallback, useState } from 'react';
import { useTheme, Icon, FontSizes, ActionButton } from '@fluentui/react';

import { Handle } from 'react-flow-renderer';

export default memo(({ data, isConnectable }) => {
    const [nameEditor, setNameEditor] = useState(false);
    const [nameText, setNameText] = useState(data.name);
    const [idEditor, setIdEditor] = useState(false);
    const [idText, setIdText] = useState(data.id);
    const theme = useTheme();

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
                style={{ background: theme.semanticColors.variantBorder }}
                isConnectable={isConnectable}
            />
            <div>
                <ActionButton
                    className="cb-oat-graph-viewer-node-cancel"
                    onClick={() =>
                        data.onDeleteNode.onDeleteNode(data.id).bind()
                    }
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
                    Name:{' '}
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
                    Id:{' '}
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
                    Type:<strong>{data.type}</strong>
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
});
