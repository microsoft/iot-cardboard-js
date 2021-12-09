import { MockAdapter } from '../../..';
import { Scene } from '../../../Models/Classes/3DVConfig';
import {
    IBlobAdapter,
    IStandaloneConsumeCardProps
} from '../../../Models/Constants/Interfaces';

export interface SceneListCardProps extends IStandaloneConsumeCardProps {
    adapter: IBlobAdapter | MockAdapter;
    onSceneClick?: (scene: Scene) => void;
}
