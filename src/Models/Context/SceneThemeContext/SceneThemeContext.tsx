import produce from 'immer';

import React, { useContext, useMemo, useReducer } from 'react';
import {
    DefaultViewerModeObjectColor,
    ISceneViewerThemeCache,
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

let isThemePersistenceEnabled = true;
const DEFAULT_OBJECT_COLOR_INDEX = 2;

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
                    draft.objectColorOptions.find(
                        (x) => x.color === action.payload.color
                    ) || DefaultViewerModeObjectColor; // fallback value in case we don't find a match
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
                // adjust the object color based on the style
                if (draft.objectStyle === ViewerObjectStyle.Default) {
                    draft.objectColor = DefaultViewerModeObjectColor;
                } else if (
                    // if NOT default style && current object color is the default, set a different option so you can see the transparency
                    draft.objectColor.color ===
                        DefaultViewerModeObjectColor.color &&
                    draft.objectColor.baseColor ===
                        DefaultViewerModeObjectColor.baseColor
                ) {
                    // changing to wireframe or transparent from default, select a color so we see the transparency
                    draft.objectColor = draft.objectColorOptions.find(
                        (x) => x.color === draft.objectColorOptions[0].color
                    ); // blue
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
                    draft.sceneBackgroundOptions.find(
                        (x) => x.color === action.payload.color
                    ) || draft.sceneBackgroundOptions[0]; // fallback value in case we don't find a match;
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

    const { initialState, shouldPersistTheme = true } = props;
    const { t } = useTranslation();
    isThemePersistenceEnabled = shouldPersistTheme; // store the selection globally

    // set the initial state for the Color reducer
    const persistedTheme = getPersistedTheme();

    const backgroundOptions =
        initialState?.sceneBackgroundOptions || ViewerModeBackgroundColors;
    const sceneBackgroundKey = persistedTheme?.backgroundKey || '';
    const sceneBackground =
        initialState?.sceneBackground ||
        backgroundOptions.find((x) => x.color === sceneBackgroundKey) ||
        backgroundOptions[0];

    const styleOptions =
        initialState?.objectStyleOptions || buildDefaultStyleChoices(t);
    const objectStyle =
        initialState?.objectStyle ||
        persistedTheme?.objectStyle ||
        ViewerObjectStyle.Default;

    const objectColorOptions =
        initialState?.objectColorOptions || ViewerModeObjectColors;
    const objectColorKey =
        persistedTheme?.objectColorKey ||
        objectColorOptions?.[DEFAULT_OBJECT_COLOR_INDEX]?.color ||
        '';
    const objectColor =
        initialState?.objectColor || objectStyle === ViewerObjectStyle.Default // use default mode for default style so we get model's built in styles
            ? DefaultViewerModeObjectColor
            : objectColorOptions?.find((x) => x.color === objectColorKey) ||
              DefaultViewerModeObjectColor;
    const defaultState: ISceneThemeContextState = {
        sceneBackground: sceneBackground,
        sceneBackgroundOptions: backgroundOptions,
        objectColor: objectColor,
        objectColorOptions: objectColorOptions,
        objectStyle: objectStyle,
        objectStyleOptions: styleOptions
    };
    logDebugConsole(
        'info',
        'Setting initial theme state. {state, stateOverrides}',
        defaultState,
        initialState
    );

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
): ISceneViewerThemeCache => {
    return {
        backgroundKey: state.sceneBackground.color,
        objectColorKey: state.objectColor?.color,
        objectStyle: state.objectStyle
    };
};
const getPersistedTheme = (): ISceneViewerThemeCache | undefined => {
    const theme = localStorage.getItem(ViewerThemeStorageKey);
    if (theme && isThemePersistenceEnabled) {
        logDebugConsole(
            'debug',
            `Reading persisted theme from storage ${ViewerThemeStorageKey}`,
            JSON.parse(theme)
        );
        return JSON.parse(theme);
    }
    return undefined;
};

const setPersistedTheme = (theme: ISceneViewerThemeCache): void => {
    if (theme && isThemePersistenceEnabled) {
        logDebugConsole(
            'debug',
            `Persisting theme to storage key ${ViewerThemeStorageKey}`,
            theme
        );
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
                text: t('modelViewerModePicker.default')
            },
            {
                key: ViewerObjectStyle.Transparent,
                imageSrc: TransparentStyle,
                imageAlt: t('modelViewerModePicker.transparent'),
                selectedImageSrc: TransparentStyle,
                imageSize: { width: 40, height: 40 },
                text: t('modelViewerModePicker.transparent')
            },
            {
                key: ViewerObjectStyle.Wireframe,
                imageSrc: WireframeStyle,
                imageAlt: t('modelViewerModePicker.wireframe'),
                selectedImageSrc: WireframeStyle,
                imageSize: { width: 40, height: 40 },
                text: t('modelViewerModePicker.wireframe')
            }
        ],
        [t]
    );

    return options;
};
