import React, { useMemo, useState } from 'react';
import OATPropertyEditor from './OATPropertyEditor';
import { PropertyContext } from './context/PropertyContext';
import useHistory from './hooks/useHistory';

export default {
    title: 'Components/OATPropertyEditor',
    component: OATPropertyEditor
};

export const Default = (_args, { globals: { theme } }) => {
    const {
        history,
        execute,
        setExecuteReference,
        setUndoReference,
        redo,
        undo,
        index
    } = useHistory([{}]);
    const [model, setModel] = useState({
        '@id': 'dtmi:com:adt:model1;',
        '@type': 'Interface',
        '@context': 'dtmi:adt:context;2',
        displayName: 'model1',
        description: '',
        comment: '',
        relationships: null,
        components: null,
        trimmedCopy: null,
        properties: [],
        contents: []
    });
    const [templates, setTemplates] = useState([
        {
            '@id': 'dtmi:com:adt:model1:prop_template_0',
            '@type': ['Property'],
            name: 'prop_template_0',
            schema: 'string',
            writable: true,
            comment: 'default comment',
            description: 'default description',
            unit: 'default unit'
        },
        {
            '@id': 'dtmi:com:adt:model1:prop_template_1',
            '@type': ['Property'],
            name: 'prop_template_1',
            schema: 'string',
            writable: true,
            comment: 'default comment',
            description: 'default description',
            unit: 'default unit'
        }
    ]);

    const providerValue = useMemo(
        () => ({
            history,
            execute,
            setExecuteReference,
            setUndoReference,
            redo,
            undo,
            index
        }),
        [
            history,
            execute,
            setExecuteReference,
            setUndoReference,
            redo,
            undo,
            index
        ]
    );

    return (
        <div
            style={{
                backgroundColor: 'white',
                display: 'flex',
                justifyContent: 'flex-end'
            }}
        >
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: '0',
                    height: '100px',
                    display: 'flex'
                }}
            >
                <button onClick={redo}>redo</button>
                <button onClick={undo}>undo</button>
                <button
                    onClick={() => {
                        console.log('history', history);
                        console.log('history index', index);
                    }}
                >
                    log history
                </button>
            </div>
            <PropertyContext.Provider value={providerValue}>
                <OATPropertyEditor
                    model={model}
                    setModel={setModel}
                    theme={theme}
                    templates={templates}
                    setTemplates={setTemplates}
                />
            </PropertyContext.Provider>
        </div>
    );
};
