import {
    IConsumeCardProps,
    IKeyValuePairAdapter
} from '../../Models/Constants/Interfaces';
export interface KeyValuePairCardProps extends IConsumeCardProps {
    adapter: IKeyValuePairAdapter;
    pollingIntervalMillis?: number;
    properties: [string];
}
