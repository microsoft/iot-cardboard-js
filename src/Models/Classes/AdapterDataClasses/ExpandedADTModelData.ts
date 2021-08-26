import { DtdlInterface } from '../../Constants/dtdlInterfaces';
import { IAdapterData } from '../../Constants/Interfaces';

interface IExpandedADTModelData {
    rootModel: DtdlInterface;
    expandedModels: DtdlInterface[];
}

class ExpandedADTModelData implements IAdapterData {
    data: IExpandedADTModelData;

    constructor(data: IExpandedADTModelData) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}

export default ExpandedADTModelData;
