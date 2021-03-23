import { IAdapterData } from '../../Constants/Interfaces';
import { ADTRelationship } from '../../Constants/Types';

class ADTRelationshipData implements IAdapterData {
    data: ADTRelationship[];

    constructor(data: ADTRelationship[]) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data.length === 0;
    }
}

export default ADTRelationshipData;
