import { ADT3DSceneAdapter, MockAdapter } from '../../Adapters';
import {
    IAdapterData,
    IComponentError,
    IUseAdapter
} from '../../Models/Constants';

export interface ScenePageErrorHandlingWrapperProps {
    adapter: ADT3DSceneAdapter | MockAdapter;
    errors: Array<IComponentError>;
    primaryClickAction?: {
        buttonText: string;
        onClick: () => void;
    };
    verifyCallbackAdapterData?: IUseAdapter<IAdapterData>;
}

export enum ScenePageErrorHandlingMode {
    Idle,
    CheckingIssues,
    DiagnosedIssues,
    ResolvingIssues,
    FinishedWithSuccess,
    FinishedWithFailure
}
