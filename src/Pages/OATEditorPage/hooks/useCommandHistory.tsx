import { useState } from 'react';

interface ICommandRecord {
    doFn: () => void;
    undoFN: () => void;
}

interface IUseCommandHistory {
    initialState?: ICommandRecord[];
}

export const useCommandHistory = (initialState?: IUseCommandHistory) => {
    const [index, setIndex] = useState(0);
    const [history, setHistory] = useState(initialState);

    const execute = (doFn, undoFn) => {
        doFn();
        setIndex(index + 1);
        const newHistory = history;
        newHistory[index] = { ...newHistory[index], doFn, undoFn };
        setHistory(newHistory);
    };

    const redo = () => {
        if (history[index]) {
            history[index].doFn();
            setIndex((previousIndex) => previousIndex + 1);
        } else {
            console.log('Nothing to redo');
        }
    };

    const undo = () => {
        if (history[index - 1]) {
            history[index - 1].undoFn();
            setIndex((previousIndex) => previousIndex - 1);
        } else {
            console.log('Nothing to undo');
        }
    };

    const canRedo = () => {
        if (history && history[index]) {
            return true;
        }
        return false;
    };

    const canUndo = () => {
        if (history && history[index - 1]) {
            return true;
        }
        return false;
    };

    return {
        execute,
        redo,
        undo,
        canRedo,
        canUndo
    };
};

export default useCommandHistory;

useCommandHistory.defaultProps = {
    initialState: []
};
