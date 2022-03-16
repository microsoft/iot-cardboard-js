import { ADTModelsData } from '../../Models/Classes/AdapterDataClasses/ADTUploadData';
import AdapterResult from '../../Models/Classes/AdapterResult';
import {
    IADTAdapter,
    IStandaloneConsumeCardProps,
} from '../../Models/Constants/Interfaces';

export interface ADTModelUploaderCardProps extends IStandaloneConsumeCardProps {
    adapter: IADTAdapter;
    hasUploadButton: boolean;
    hasMessageBar: boolean;
    onUploadFinish?: (adapterResult: AdapterResult<ADTModelsData>) => void;
    onFileListChanged?: (files: Array<File>) => void;
    existingFiles?: Array<File>;
}
