import { useState, useMemo } from 'react';

interface ICommandRecord {
    do: () => void;
    undo: () => void;
}

interface ICommandHistory {
    execute: (doFn: () => void, undoFn: () => void) => void;
    redo: () => void;
    undo: () => void;
    canRedo: boolean;
    canUndo: boolean;
}

interface IUseCommandHistory {
    initialState?: ICommandRecord[];
}

export const useCommandHistory = (
    initialState?: IUseCommandHistory
): ICommandHistory => {
    const [index, setIndex] = useState(0);
    const [history] = useState(initialState);

    const execute = (doFn, undoFn) => {
        doFn();
        history.length = index; // clear history after current index
        setIndex(index + 1);
        history.push({ doFn, undoFn });
    };

    const canRedo = useMemo(() => history && !!history[index], [index]);
    const canUndo = useMemo(() => history && !!history[index - 1], [index]);

    const redo = () => {
        if (canRedo) {
            history[index].doFn();
            setIndex((previousIndex) => previousIndex + 1);
        }
    };

    const undo = () => {
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
