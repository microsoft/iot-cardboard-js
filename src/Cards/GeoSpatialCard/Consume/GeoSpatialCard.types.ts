import {
    IKeyValuePairAdapter,
    IConsumeCardProps
} from '../../../Models/Constants';
export interface GeoSpatialCardProps extends IConsumeCardProps {
    adapter: IKeyValuePairAdapter;
    pollingIntervalMillis: number;
}
