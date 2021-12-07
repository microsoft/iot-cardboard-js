import { MockAdapter } from '../../..';
import {
    IADTAdapter,
    IStandaloneConsumeCardProps
} from '../../../Models/Constants/Interfaces';

export interface SceneListCardProps extends IStandaloneConsumeCardProps {
    adapter: IADTAdapter | MockAdapter;
}
