import IBaseAdapter from '../../../Adapters/IBaseAdapter';
import { IConsumeCardProps } from '../../../Models/Constants/Interfaces';

export interface LKVProcessGraphicCardProps extends IConsumeCardProps {
    pollingIntervalMillis: number;
    imageSrc: string;
    adapter: IBaseAdapter;
}
