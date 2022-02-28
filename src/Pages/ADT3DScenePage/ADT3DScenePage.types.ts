import MockAdapter from '../../Adapters/MockAdapter';
import ADTandBlobAdapter from '../../Adapters/ADTandBlobAdapter';
import { IScene, IScenesConfig } from '../../Models/Classes/3DVConfig';
import {
    ADT3DScenePageModes,
    ADT3DScenePageSteps
} from '../../Models/Constants/Enums';
import {
    IComponentError,
    IAction,
    IConsumeCompositeCardProps,
    IADTInstance
} from '../../Models/Constants/Interfaces';

export interface IADT3DScenePageProps extends IConsumeCompositeCardProps {
    adapter: ADTandBlobAdapter | MockAdapter;
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
