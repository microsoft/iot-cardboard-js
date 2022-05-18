import { ADT3DSceneAdapter, MockAdapter } from '../../Adapters';
import ADTScenesConfigData from '../../Models/Classes/AdapterDataClasses/ADTScenesConfigData';
import { IComponentError, IUseAdapter } from '../../Models/Constants';

export interface ScenePageErrorHandlingWrapperProps {
    adapter: ADT3DSceneAdapter | MockAdapter;
    errors: Array<IComponentError>;
    primaryClickAction?: {
        buttonText: string;
        onClick: () => void;
    };
    reloadPageAdapterData?: IUseAdapter<ADTScenesConfigData>;
}
