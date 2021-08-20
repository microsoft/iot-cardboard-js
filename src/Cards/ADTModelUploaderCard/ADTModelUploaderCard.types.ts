import { ADTModelsData } from '../../Models/Classes/AdapterDataClasses/ADTUploadData';
import AdapterResult from '../../Models/Classes/AdapterResult';
import { IStandaloneConsumeCardProps } from '../../Models/Constants/Interfaces';

export interface ADTModelUploaderCardProps extends IStandaloneConsumeCardProps {
    hasUploadButton: boolean;
    hasMessageBar: boolean;
    onUploadFinish?: (adapterResult: AdapterResult<ADTModelsData>) => void;
}
