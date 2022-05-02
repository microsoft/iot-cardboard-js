import { useState } from 'react';

export const useHistory = (initialState) => {
    const [index, setIndex] = useState(0);
    const [history, setHistory] = useState(initialState);

    const execute = (action) => {
        action();
        setExecuteReference(action);
        setIndex(index + 1);
        const newHistory = history;
        newHistory.push({});
        setHistory(newHistory);
    };

    const setExecuteReference = (action) => {
        const newHistory = [...history];
        newHistory[index].executeReference = action;
        setHistory(newHistory);
    };

    const setUndoReference = (action) => {
        const newHistory = [...history];
        newHistory[index].undoReference = action;
        setHistory(newHistory);
    };

    const redo = () => {
        if (history[index].executeReference) {
            history[index].executeReference();
            setIndex((previousIndex) => previousIndex + 1);
        } else {
            console.log('Nothing to redo');
        }
    };

    const undo = () => {
        if (history[index - 1] && history[index - 1].undoReference) {
            history[index - 1].undoReference();
            setIndex((previousIndex) => previousIndex - 1);
        } else {
            console.log('Nothing to undo');
        }
    };

    return {
        history,
        execute,
        setExecuteReference,
        setUndoReference,
        redo,
        undo,
        index
    };
};

export default useHistory;
