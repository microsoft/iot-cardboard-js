import { IConsumeCardProps } from '../../../Models/Constants/Interfaces';
export interface KeyValuePairCardProps extends IConsumeCardProps {
    pollingIntervalMillis?: number;
    properties: [string];
}
