import { IADTAdapter, IConsumeCardProps } from '../../Models/Constants';
export interface BIMViewerCardProps
    extends Omit<IConsumeCardProps, 'properties'> {
    adapter: IADTAdapter;
    id: string;
    centeredObject?: string;
}
