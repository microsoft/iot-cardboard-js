import MockAdapter from '../../../Adapters/MockAdapter';
import ADTandBlobAdapter from '../../../Adapters/ADTandBlobAdapter';
import { IScene, IScenesConfig } from '../../../Models/Classes/3DVConfig';
import {
    ADT3DScenePageModes,
    ADT3DScenePageSteps
} from '../../../Models/Constants/Enums';
import {
    IComponentError,
    IAction,
    IConsumeCompositeCardProps
} from '../../../Models/Constants/Interfaces';

export interface IADT3DScenePageProps extends IConsumeCompositeCardProps {
    adapter: ADTandBlobAdapter | MockAdapter;
    environmentPickerOptions?: {
        isLocalStorageEnabledForEnvironment?: boolean;
        isLocalStorageEnabledForContainer?: boolean;
        environmentsLocalStorageKey?: string;
        containersLocalStorageKey?: string;
        selectedEnvironmentLocalStorageKey?: string;
        selectedContainerLocalStorageKey?: string;
    };
}

export interface IADT3DSceneBuilderProps extends IConsumeCompositeCardProps {
    adapter: ADTandBlobAdapter | MockAdapter;
    mode: ADT3DScenePageModes;
    scene: IScene;
    scenesConfig: IScenesConfig;
    refetchConfig?: () => any;
}

export interface ADT3DScenePageState {
    scenesConfig: IScenesConfig;
    selectedBlobContainerURL: string;
    selectedScene: IScene;
    scene?: IScene;
    errors?: Array<IComponentError>;
    scenePageMode: ADT3DScenePageModes;
}

export interface ADT3DScenePageState {
    selectedScene: IScene;
    currentStep: ADT3DScenePageSteps;
}

export interface IADT3DScenePageContext {
    state: ADT3DScenePageState;
    dispatch: React.Dispatch<IAction>;
    handleOnHomeClick: () => void;
}
