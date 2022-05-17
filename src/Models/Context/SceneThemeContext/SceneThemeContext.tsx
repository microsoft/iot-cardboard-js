import produce from 'immer';

import React, { useContext, useMemo, useReducer } from 'react';
import {
    IADT3DViewerMode,
    ViewerModeBackgroundColors,
    ViewerModeObjectColors,
    ViewerObjectStyle,
    ViewerThemeStorageKey
} from '../../Constants';
import { getDebugLogger } from '../../Services/Utils';
import DefaultStyle from '../../../Resources/Static/default.svg';
import TransparentStyle from '../../../Resources/Static/transparent.svg';
import WireframeStyle from '../../../Resources/Static/wireframe.svg';
import {
    SceneThemeContextAction,
    SceneThemeContextActionType,
    ISceneThemeContext,
    ISceneThemeContextProviderProps,
    ISceneThemeContextState,
    IObjectStyleOption
} from './SceneThemeContext.types';
import { TFunction, useTranslation } from 'react-i18next';

const debugLogging = false;
const logDebugConsole = getDebugLogger('SceneThemeContext', debugLogging);

const SceneThemeContextInstance = React.createContext<ISceneThemeContext>(null);
export const useSceneThemeContext = () => useContext(SceneThemeContextInstance);

export const SceneThemeContextReducer: (
    draft: ISceneThemeContextState,
    action: SceneThemeContextAction
) => ISceneThemeContextState = produce(
    (draft: ISceneThemeContextState, action: SceneThemeContextAction) => {
        logDebugConsole(
            'info',
            `Updating Color context ${action.type} with payload: `,
            action.payload
        );
        switch (action.type) {
            case SceneThemeContextActionType.SET_OBJECT_COLOR: {
                draft.objectColor =
                    action.payload.color ||
                    draft.objectColorOptions?.[0]?.color ||
                    '';
                setPersistedTheme(buildPersistedTheme(draft));
                break;
            }
            case SceneThemeContextActionType.SET_OBJECT_COLOR_OPTIONS: {
                draft.objectColorOptions = action.payload.options || [];
                break;
            }
            case SceneThemeContextActionType.SET_OBJECT_STYLE: {
                draft.objectStyle =
                    action.payload.style || ViewerObjectStyle.Default;
                if (draft.objectStyle === ViewerObjectStyle.Default) {
                    draft.objectColor = draft.objectColorOptions[0].color;
                }
                setPersistedTheme(buildPersistedTheme(draft));
                break;
            }
            case SceneThemeContextActionType.SET_OBJECT_STYLE_OPTIONS: {
                draft.objectStyleOptions = action.payload.options || [];
                break;
            }
            case SceneThemeContextActionType.SET_SCENE_BACKGROUND: {
                draft.sceneBackground =
                    action.payload.color ||
                    draft.sceneBackgroundOptions?.[0]?.color ||
                    '';
                setPersistedTheme(buildPersistedTheme(draft));
                break;
            }
            case SceneThemeContextActionType.SET_SCENE_BACKGROUND_OPTIONS: {
                draft.sceneBackgroundOptions = action.payload.options || [];
                break;
            }
        }
    }
);

export const SceneThemeContextProvider: React.FC<ISceneThemeContextProviderProps> = (
    props
) => {
    const { children } = props;

    // skip wrapping if the context already exists
    const existingContext = useSceneThemeContext();
    if (existingContext) {
        return <>{children}</>;
    }

    const { initialState } = props;
    const { t } = useTranslation();

    // set the initial state for the Color reducer
    const persistedTheme = getPersistedTheme();
    const objectColorOptions =
        initialState?.objectColorOptions || ViewerModeObjectColors;
    const backgroundOptions =
        initialState?.sceneBackgroundOptions || ViewerModeBackgroundColors;
    const defaultState: ISceneThemeContextState = {
        sceneBackground:
            initialState?.sceneBackground ||
            persistedTheme?.background?.color ||
            initialState?.objectColorOptions?.[0]?.color ||
            '',
        sceneBackgroundOptions: backgroundOptions,
        objectColor:
            initialState?.objectColor ||
            persistedTheme?.objectColor?.color ||
            objectColorOptions?.[0].color ||
            '',
        objectColorOptions: objectColorOptions,
        objectStyle: initialState?.objectStyle || ViewerObjectStyle.Default,
        objectStyleOptions:
            initialState?.objectStyleOptions || buildDefaultStyleChoices(t)
    };

    const [sceneThemeState, sceneThemeDispatch] = useReducer(
        SceneThemeContextReducer,
        defaultState
    );

    return (
        <SceneThemeContextInstance.Provider
            value={{ sceneThemeState, sceneThemeDispatch }}
        >
            {children}
        </SceneThemeContextInstance.Provider>
    );
};

const buildPersistedTheme = (
    state: ISceneThemeContextState
): IADT3DViewerMode => {
    const background = state?.sceneBackgroundOptions.find(
        (bc) => state?.sceneBackground === bc?.color
    );
    const objectColor = state?.objectColorOptions.find(
        (oc) => state?.objectColor === oc?.color
    );
    return {
        background: background,
        isWireframe: state.objectStyle === ViewerObjectStyle.Wireframe,
        objectColor: objectColor,
        style: state.objectStyle
    };
};
const getPersistedTheme = (): IADT3DViewerMode | undefined => {
    const theme = localStorage.getItem(ViewerThemeStorageKey);
    if (theme) {
        return JSON.parse(theme);
    }
    return undefined;
};

const setPersistedTheme = (theme: IADT3DViewerMode): void => {
    if (theme) {
        localStorage.setItem(ViewerThemeStorageKey, JSON.stringify(theme));
    }
};

const buildDefaultStyleChoices = (t: TFunction<string>) => {
    const options: IObjectStyleOption[] = useMemo(
        () => [
            {
                key: ViewerObjectStyle.Default,
                imageSrc: DefaultStyle,
                imageAlt: t('modelViewerModePicker.default'),
                selectedImageSrc: DefaultStyle,
                imageSize: { width: 40, height: 40 },
                text: t('modelViewerModePicker.default'),
                styles: {
                    innerField: {
                        width: 100,
                        padding: 0,
                        justifyContent: 'center'
                    }
                }
            },
            {
                key: ViewerObjectStyle.Transparent,
                imageSrc: TransparentStyle,
                imageAlt: t('modelViewerModePicker.transparent'),
                selectedImageSrc: TransparentStyle,
                imageSize: { width: 40, height: 40 },
                text: t('modelViewerModePicker.transparent'),
                styles: {
                    innerField: {
                        width: 100,
                        padding: 0,
                        justifyContent: 'center'
                    }
                }
            },
            {
                key: ViewerObjectStyle.Wireframe,
                imageSrc: WireframeStyle,
                imageAlt: t('modelViewerModePicker.wireframe'),
                selectedImageSrc: WireframeStyle,
                imageSize: { width: 40, height: 40 },
                text: t('modelViewerModePicker.wireframe'),
                styles: {
                    innerField: {
                        width: 100,
                        padding: 0,
                        justifyContent: 'center'
                    }
                }
            }
        ],
        [t]
    );

    return options;
};
