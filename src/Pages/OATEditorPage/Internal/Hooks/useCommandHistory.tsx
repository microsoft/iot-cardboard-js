import { useState, useMemo } from 'react';
import { getDebugLogger } from '../../../../Models/Services/Utils';

interface ICommandRecord {
    doFn: () => void;
    undoFn: () => void;
}

interface ICommandHistory {
    execute: (doFn: () => void, undoFn: () => void) => void;
    redo: () => void;
    undo: () => void;
    canRedo: boolean;
    canUndo: boolean;
}

const debugLogging = false;
const logDebugConsole = getDebugLogger('useCommandHistory', debugLogging);

export const useCommandHistory = (
    initialState?: ICommandRecord[]
): ICommandHistory => {
    const [index, setIndex] = useState(0);
    const [history, setHistory] = useState(initialState);

    const execute = (doFn, undoFn) => {
        doFn();
        setHistory([...history.slice(0, index), { doFn, undoFn }]);
        logDebugConsole(
            'debug',
            `Executing action. History: ${history.length}.`
        );
        setIndex(index + 1);
    };

    const canRedo = useMemo(() => history && !!history[index], [
        index,
        history
    ]);
    const canUndo = useMemo(() => history && !!history[index - 1], [
        index,
        history
    ]);

    const redo = () => {
        logDebugConsole(
            'debug',
            `Redo. History: ${history.length}. Index: ${index}.`
        );
        if (canRedo) {
            history[index].doFn();
            setIndex((previousIndex) => previousIndex + 1);
        }
    };

    const undo = () => {
        logDebugConsole(
            'debug',
            `Undo. History: ${history.length}. Index: ${index}.`
        );
        if (canUndo) {
            history[index - 1].undoFn();
            setIndex((previousIndex) => previousIndex - 1);
        }
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
