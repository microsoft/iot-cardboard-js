import React, { createContext, useContext } from 'react';
import useCommandHistory from '../Hooks/useCommandHistory';

export const CommandHistoryContext = createContext(null);
export const useCommandHistoryContext = () => useContext(CommandHistoryContext);

export const CommandHistoryContextProvider: React.FC = (props) => {
    const { children } = props;

    // skip wrapping if the context already exists
    const existingContext = useCommandHistoryContext();
    if (existingContext) {
        return <>{children}</>;
    }

    const providerValue = useCommandHistory([]);

    return (
        <CommandHistoryContext.Provider value={providerValue}>
            {children}
        </CommandHistoryContext.Provider>
    );
};
