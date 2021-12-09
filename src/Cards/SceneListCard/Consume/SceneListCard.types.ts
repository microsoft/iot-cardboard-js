import { MockAdapter } from '../../..';
import {
    IBlobAdapter,
    IStandaloneConsumeCardProps
} from '../../../Models/Constants/Interfaces';

export interface SceneListCardProps extends IStandaloneConsumeCardProps {
    adapter: IBlobAdapter | MockAdapter;
}
