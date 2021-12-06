import {
    IADTAdapter,
    IADTTwin,
    IStandaloneConsumeCardProps
} from '../../../Models/Constants/Interfaces';

export interface SceneListCardProps extends IStandaloneConsumeCardProps {
    adapter: IADTAdapter;
    onSceneClick?: (sceneTwin: IADTTwin) => void;
}
