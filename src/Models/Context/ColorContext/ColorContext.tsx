import produce from 'immer';
import React, { useContext, useReducer } from 'react';
import { ViewerObjectStyle } from '../../Constants';
import { getDebugLogger } from '../../Services/Utils';
import {
    ColorContextAction,
    ColorContextActionType,
    IColorContext,
    IColorContextProviderProps,
    IColorContextState
} from './ColorContext.types';

const debugLogging = false;
const logDebugConsole = getDebugLogger('ColorContext', debugLogging);

const DEFAULT_OBJECT_COLOR = '';
const DEFAULT_SCENE_BACKGROUND = '';

const ColorContextInstance = React.createContext<IColorContext>(null);
export const useColorContext = () => useContext(ColorContextInstance);

export const ColorContextReducer: (
    draft: IColorContextState,
    action: ColorContextAction
) => IColorContextState = produce(
    (draft: IColorContextState, action: ColorContextAction) => {
        logDebugConsole(
            'info',
            `Updating Color context ${action.type} with payload: `,
            action.payload
        );
        switch (action.type) {
            case ColorContextActionType.SET_OBJECT_COLOR: {
                draft.objectColor =
                    action.payload.color || DEFAULT_OBJECT_COLOR;
                break;
            }
            case ColorContextActionType.SET_OBJECT_STYLE: {
                draft.objectStyle =
                    action.payload.style || ViewerObjectStyle.Default;
                break;
            }
            case ColorContextActionType.SET_SCENE_BACKGROUND: {
                draft.sceneBackground =
                    action.payload.color || DEFAULT_SCENE_BACKGROUND;
                break;
            }
        }
    }
);

export const ColorContextProvider: React.FC<IColorContextProviderProps> = (
    props
) => {
    const { children } = props;

    // skip wrapping if the context already exists
    const existingContext = useColorContext();
    if (existingContext) {
        return <>{children}</>;
    }

    const { initialState } = props;

    // set the initial state for the Color reducer
    const defaultState: IColorContextState = {
        sceneBackground:
            initialState?.sceneBackground || DEFAULT_SCENE_BACKGROUND,
        objectColor: initialState?.objectColor || DEFAULT_OBJECT_COLOR,
        objectStyle: initialState?.objectStyle || ViewerObjectStyle.Default
    };

    const [colorState, colorDispatch] = useReducer(
        ColorContextReducer,
        defaultState
    );

    return (
        <ColorContextInstance.Provider value={{ colorState, colorDispatch }}>
            {children}
        </ColorContextInstance.Provider>
    );
};
