import {
    IConsumeCardProps,
    IKeyValuePairAdapter,
} from '../../Models/Constants/Interfaces';
import { ImgPropertyPositions } from '../../Models/Constants/Types';

export interface LKVProcessGraphicCardProps extends IConsumeCardProps {
    adapter: IKeyValuePairAdapter;
    pollingIntervalMillis: number;
    imageSrc: string;
    imagePropertyPositions: Record<string, ImgPropertyPositions>; //property name and positions pairs
}
