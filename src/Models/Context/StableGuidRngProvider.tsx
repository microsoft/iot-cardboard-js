import React, { useContext, useRef } from 'react';
import seedRandom from 'seedrandom';

export const StableGuidRng = React.createContext<() => number>(null);
export const useStableGuidRng = () => useContext(StableGuidRng);

type Props = {
    children: React.ReactNode;
    seed: string;
};

export const StableGuidRngProvider = ({ children, seed }: Props) => {
    const seededRandomNumGen = useRef(seedRandom(seed));
    return (
        <StableGuidRng.Provider value={seededRandomNumGen.current}>
            {children}
        </StableGuidRng.Provider>
    );
};
