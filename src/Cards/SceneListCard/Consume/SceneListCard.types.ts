import { MockAdapter } from '../../..';
import {
    IADTTwin,
    IStandaloneConsumeCardProps
} from '../../../Models/Constants/Interfaces';

export interface SceneListCardProps extends IStandaloneConsumeCardProps {
    adapter: MockAdapter;
    onSceneClick?: (sceneTwin: IADTTwin) => void;
}
