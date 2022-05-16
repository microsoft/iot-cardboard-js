import React, { useContext } from 'react';
import {
    I3DColorContext,
    I3DColorContextProviderProps
} from './3DColorContext.types';

const _3DColorContextInstance = React.createContext<I3DColorContext>(null);
export const use3DColorContext = () => useContext(_3DColorContextInstance);

export const _3DColorContextProvider: React.FC<I3DColorContextProviderProps> = (
    props
) => {
    const { children } = props;

    // skip wrapping if the context already exists
    const existingContext = use3DColorContext();
    if (existingContext) {
        console.log('Already here');
        return <>{children}</>;
    }

    const { onOverrideColors } = props;
    console.log('rednering context', onOverrideColors);

    return (
        <_3DColorContextInstance.Provider
            value={{
                onOverrideColors
            }}
        >
            {children}
        </_3DColorContextInstance.Provider>
    );
};
