import {
    IADTAdapter,
    IADTTwin,
    IStandaloneConsumeCardProps
} from '../../../Models/Constants/Interfaces';

export interface SceneListCardProps extends IStandaloneConsumeCardProps {
    adapter: IADTAdapter;
    onEditScene?: (sceneTwin: IADTTwin, sceneTwinIndex: number) => void;
    onAddScene?: () => void;
}
