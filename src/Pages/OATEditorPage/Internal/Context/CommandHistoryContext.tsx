import React, { createContext, useContext } from 'react';
import useCommandHistory from '../Hooks/useCommandHistory';

interface ICommandHistoryContext {
    execute: (doFn: () => void, undoFn: () => void) => void;
    redo: () => void;
    undo: () => void;
    canRedo: boolean;
    canUndo: boolean;
}

export const CommandHistoryContext = createContext<ICommandHistoryContext>(
    null
);
export const useCommandHistoryContext = () => useContext(CommandHistoryContext);

export const CommandHistoryContextProvider: React.FC = (props) => {
    const { children } = props;

    // skip wrapping if the context already exists
    const existingContext = useCommandHistoryContext();
    if (existingContext) {
        return <>{children}</>;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const providerValue = useCommandHistory([]);

    return (
        <CommandHistoryContext.Provider value={providerValue}>
            {children}
        </CommandHistoryContext.Provider>
    );
};
