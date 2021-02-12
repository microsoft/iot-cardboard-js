import IoTCentralAdapter from '../../../Adapters/IoTCentralAdapter';
import { ConsumeCardProps } from '../../../Constants/Interfaces';
export interface LKVProcessGraphicCardProps extends ConsumeCardProps {
    pollingIntervalMillis: number;
    imageSrc: string;
    adapter: IoTCentralAdapter;
}
