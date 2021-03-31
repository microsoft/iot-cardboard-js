import { IConsumeCardProps } from '../../../Models/Constants/Interfaces';

export interface LKVProcessGraphicCardProps extends IConsumeCardProps {
    pollingIntervalMillis: number;
    imageSrc: string;
    imagePropertyPositions: Record<string, any>; //object of property name and position object pairs e.g. {OilPressure: { left: '30%', top: '70%' }}
}
