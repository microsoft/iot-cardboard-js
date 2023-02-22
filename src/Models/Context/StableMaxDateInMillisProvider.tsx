import React, { useContext, useRef } from 'react';

const StableMaxDateInMillis = React.createContext<number>(null);
export const useStableMaxDateInMillis = () => useContext(StableMaxDateInMillis);

type Props = {
    children: React.ReactNode;
    maxDateInMillis: number;
};

export const StableMaxDateInMillisProvider = ({
    children,
    maxDateInMillis
}: Props) => {
    const maxDateInMillisRef = useRef(maxDateInMillis);
    return (
        <StableMaxDateInMillis.Provider value={maxDateInMillisRef.current}>
            {children}
        </StableMaxDateInMillis.Provider>
    );
};
