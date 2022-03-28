import React, { memo, useCallback, useState } from 'react';

import { Handle } from 'react-flow-renderer';

export default memo(({ data, isConnectable }) => {
    const [nameEditor, setNameEditor] = useState(false);
    const [nameText, setNameText] = useState(data.name);
    const [idEditor, setIdEditor] = useState(false);
    const [idText, setIdText] = useState(data.id);

    const onNameChange = useCallback((evt) => {
        data.name = evt.target.value;
        setNameText(evt.target.value);
    }, []);

    const onNameClick = useCallback((evt) => {
        setNameEditor(true);
    }, []);

    const onNameBlur = useCallback((evt) => {
        setNameEditor(false);
    }, []);

    const onIdChange = useCallback((evt) => {
        data.id = evt.target.value;
        setIdText(evt.target.value);
    }, []);

    const onIdClick = useCallback((evt) => {
        setIdEditor(true);
    }, []);

    const onIdBlur = useCallback((evt) => {
        setIdEditor(false);
    }, []);

    return (
        <>
            <Handle
                type="target"
                position="top"
                style={{ background: '#555' }}
                isConnectable={isConnectable}
            />
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
                <br />
                Id:{' '}
                {!idEditor && <strong onClick={onIdClick}>{data.id}</strong>}
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
            <Handle
                type="source"
                position="bottom"
                id="Relationship"
                style={{ left: '20%', background: '#555' }}
                isConnectable={isConnectable}
            />
            <Handle
                type="source"
                position="bottom"
                id="untargeted_relationship"
                style={{ left: '40%', background: '#555' }}
                isConnectable={isConnectable}
            />
            <Handle
                type="source"
                position="bottom"
                id="extend"
                style={{ left: '60%', background: '#555', stroke: '#f6ab6c' }}
                isConnectable={isConnectable}
            />
            <Handle
                type="source"
                position="bottom"
                id="component_reference"
                style={{ left: '80%', background: '#555' }}
                isConnectable={isConnectable}
            />
        </>
    );
});
