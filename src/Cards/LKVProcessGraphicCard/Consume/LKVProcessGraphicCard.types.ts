import { IBaseAdapter } from '../../../Adapters/IBaseAdapter';
import { ConsumeCardProps } from '../../../Constants/Interfaces';

export interface LKVProcessGraphicCardProps extends ConsumeCardProps {
    pollingIntervalMillis: number;
    imageSrc: string;
    adapter: IBaseAdapter;
}
