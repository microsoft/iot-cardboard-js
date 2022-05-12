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
    IADTInstance
} from '../../Models/Constants/Interfaces';
import {
    I3DScenesConfig,
    IScene
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

export interface IADT3DScenePageProps extends IConsumeCompositeCardProps {
    adapter: ADT3DSceneAdapter | MockAdapter;
    environmentPickerOptions?: {
        environment?: {
            shouldPullFromSubscription?: boolean; // to have this worked with the set value 'true' make sure you pass tenantId and uniqueObjectId to your adapter
            isLocalStorageEnabled?: boolean;
            localStorageKey?: string;
            selectedItemLocalStorageKey?: string;
            onEnvironmentChange?: (
                environment: string | IADTInstance,
                environments: Array<string | IADTInstance>
            ) => void;
        };
        storage?: {
            isLocalStorageEnabled?: boolean;
            localStorageKey?: string;
            selectedItemLocalStorageKey?: string;
            onContainerChange?: (
                containerUrl: string,
                containerUrls: Array<string>
            ) => void;
        };
    };
    enableTwinPropertyInspectorPatchMode?: boolean;
}

export interface IADT3DSceneBuilderProps extends IConsumeCompositeCardProps {
    adapter: ADT3DSceneAdapter | MockAdapter;
    mode: ADT3DScenePageModes;
    sceneId: string;
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

export interface ADT3DScenePageState {
    currentStep: ADT3DScenePageSteps;
    scenesConfig: I3DScenesConfig;
    selectedBlobContainerURL: string;
    selectedScene: IScene;
    scene?: IScene;
    errors?: Array<IComponentError>;
    errorCallback: IErrorButtonAction;
}

export interface IADT3DScenePageContext {
    state: ADT3DScenePageState;
    dispatch: React.Dispatch<IAction>;
    handleOnHomeClick: () => void;
    handleOnSceneClick: (scene: IScene) => void;
    isTwinPropertyInspectorPatchModeEnabled: boolean;
}
