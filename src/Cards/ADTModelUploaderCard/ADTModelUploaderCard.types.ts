import ADTAdapter from '../../Adapters/ADTAdapter';
import { ADTModelsData } from '../../Models/Classes/AdapterDataClasses/ADTUploadData';
import AdapterResult from '../../Models/Classes/AdapterResult';
import {
    IJSONUploaderFileItem,
    IStandaloneConsumeCardProps
} from '../../Models/Constants/Interfaces';

export interface ADTModelUploaderCardProps extends IStandaloneConsumeCardProps {
    adapter: ADTAdapter;
    hasUploadButton: boolean;
    hasMessageBar: boolean;
    onUploadFinish?: (adapterResult: AdapterResult<ADTModelsData>) => void;
    onFileListChanged?: (fileItems: Array<IJSONUploaderFileItem>) => void;
    existingFileListItems?: Array<IJSONUploaderFileItem>;
}
