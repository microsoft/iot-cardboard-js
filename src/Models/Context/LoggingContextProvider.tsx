import React, { useContext } from 'react';

export const LoggingContext = React.createContext<{ isStorybookEnv: boolean }>(
    null
);
export const useLoggingContext = () => useContext(LoggingContext);

type Props = {
    children: React.ReactNode;
};

export const LoggingContextProvider = ({ children }: Props) => {
    return (
        <LoggingContext.Provider value={{ isStorybookEnv: true }}>
            {children}
        </LoggingContext.Provider>
    );
};
