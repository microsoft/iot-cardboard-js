import { MockAdapter } from '../../../Adapters';
import { IConsumeCardProps } from '../../../Models/Constants/Interfaces';

export interface SceneListCardProps extends IConsumeCardProps {
    //TODO: add blob adapter
    adapter: MockAdapter;
}
