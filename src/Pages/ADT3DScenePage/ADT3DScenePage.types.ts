import MockAdapter from '../../Adapters/MockAdapter';
import ADT3DSceneAdapter from '../../Adapters/ADT3DSceneAdapter';
import {
    ADT3DScenePageModes,
    ADT3DScenePageSteps
} from '../../Models/Constants/Enums';
import {
    IComponentError,
    IAction,
    IConsumeCompositeCardProps,
    IErrorButtonAction,
    IADTInstance,
    IAzureStorageBlobContainer,
    IADXConnection
} from '../../Models/Constants/Interfaces';
import {
    I3DScenesConfig,
    IScene
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

export interface IADT3DScenePageProps extends IConsumeCompositeCardProps {
    adapter: ADT3DSceneAdapter | MockAdapter;
    environmentPickerOptions?: {
        adt?: {
            isLocalStorageEnabled?: boolean;
            localStorageKey?: string;
            selectedItemLocalStorageKey?: string;
            onAdtInstanceChange?: (
                adtInstance: string | IADTInstance,
                adtInstances: Array<string | IADTInstance>
            ) => void;
        };
        storage?: {
            isLocalStorageEnabled?: boolean;
            localStorageKey?: string;
            selectedItemLocalStorageKey?: string;
            onContainerChange?: (
                container: string | IAzureStorageBlobContainer,
                containers: Array<string | IAzureStorageBlobContainer>
            ) => void;
        };
    };
    enableTwinPropertyInspectorPatchMode?: boolean;
}

export interface IADT3DSceneBuilderProps extends IConsumeCompositeCardProps {
    adapter: ADT3DSceneAdapter | MockAdapter;
    scenesConfig: I3DScenesConfig;
    refetchConfig?: () => void;
}

export interface ISceneContentsProps {
    adapter: ADT3DSceneAdapter | MockAdapter;
    mode: ADT3DScenePageModes;
    refetchConfig?: () => void;
    sceneId: string;
    scenesConfig: I3DScenesConfig;
}

export interface IADT3DScenePageState {
    currentStep: ADT3DScenePageSteps;
    scenesConfig: I3DScenesConfig;
    selectedBlobContainerURL: string;
    selectedScene: IScene;
    scene?: IScene;
    errors?: Array<IComponentError>;
    errorCallback: IADT3DScenePageErrorCallback;
    adxConnectionInformation: {
        connection: IADXConnection;
        loadingState: ADXConnectionInformationLoadingState;
    };
}

export interface IADT3DScenePageContext {
    state: IADT3DScenePageState;
    dispatch: React.Dispatch<IAction>;
    handleOnHomeClick: () => void;
    handleOnSceneClick: (scene: IScene) => void;
    handleOnSceneSwap: (sceneId: string) => void;
    isTwinPropertyInspectorPatchModeEnabled: boolean;
}

export interface IADT3DScenePageErrorCallback {
    primary: IErrorButtonAction;
    secondary?: IErrorButtonAction;
    link?: IErrorButtonAction;
}

export enum ADXConnectionInformationLoadingState {
    IDLE,
    LOADING,
    EXIST,
    NOT_EXIST
}

export enum ADT3DScenePageActionTypes {
    SET_ADT_SCENE_CONFIG = 'SET_ADT_SCENE_CONFIG',
    SET_CURRENT_STEP = 'SET_CURRENT_STEP',
    SET_SELECTED_SCENE = 'SET_SELECTED_SCENE',
    SET_ERRORS = 'SET_ERRORS',
    SET_ERROR_CALLBACK = 'SET_ERROR_CALLBACK',
    SET_ADX_CONNECTION_INFORMATION = 'SET_ADX_CONNECTION_INFORMATION'
}

export type ADT3DScenePageAction =
    | {
          type: ADT3DScenePageActionTypes.SET_ADT_SCENE_CONFIG;
          payload: {
              scenesConfig: I3DScenesConfig | null;
          };
      }
    | {
          type: ADT3DScenePageActionTypes.SET_CURRENT_STEP;
          payload: {
              currentStep: ADT3DScenePageSteps;
          };
      }
    | {
          type: ADT3DScenePageActionTypes.SET_SELECTED_SCENE;
          payload: {
              selectedScene: IScene | null;
          };
      }
    | {
          type: ADT3DScenePageActionTypes.SET_ERRORS;
          payload: {
              errors: Array<IComponentError>;
          };
      }
    | {
          type: ADT3DScenePageActionTypes.SET_ERROR_CALLBACK;
          payload: {
              errorCallback: IADT3DScenePageErrorCallback | null;
          };
      }
    | {
          type: ADT3DScenePageActionTypes.SET_ADX_CONNECTION_INFORMATION;
          payload: {
              adxConnectionInformation: {
                  connection: IADXConnection;
                  loadingState: ADXConnectionInformationLoadingState;
              };
          };
      };
