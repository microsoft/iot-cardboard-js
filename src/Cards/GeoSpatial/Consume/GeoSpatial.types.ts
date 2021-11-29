import {  IKeyValuePairAdapter, IConsumeCardProps } from '../../../Models/Constants';
export interface GeoSpatialProps extends IConsumeCardProps {
    adapter: IKeyValuePairAdapter;
    pollingIntervalMillis: number;
}