import { MockAdapter } from '../../..';
import {
    IADTAdapter,
    IADTTwin,
    IStandaloneConsumeCardProps
} from '../../../Models/Constants/Interfaces';

export interface SceneListCardProps extends IStandaloneConsumeCardProps {
    adapter: IADTAdapter | MockAdapter;
    onSceneClick?: (sceneTwin: IADTTwin) => void;
}
