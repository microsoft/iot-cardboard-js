import { IConsumeCardProps } from '../../../Models/Constants/Interfaces';
import { ImgPropertyPositions } from '../../../Models/Constants/Types';

export interface LKVProcessGraphicCardProps extends IConsumeCardProps {
    pollingIntervalMillis: number;
    imageSrc: string;
    imagePropertyPositions: Record<string, ImgPropertyPositions>; //property name and positions pairs
}
