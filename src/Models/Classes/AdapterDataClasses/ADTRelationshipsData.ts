import { IAdapterData, IADTRelationship } from '../../Constants/Interfaces';
import { ADTRelationship } from '../../Constants/Types';

class ADTRelationshipsData implements IAdapterData {
    data: ADTRelationship[];

    constructor(data: ADTRelationship[]) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data.length === 0;
    }
}

class ADTRelationshipData implements IAdapterData {
    data: IADTRelationship;

    constructor(data: IADTRelationship) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data.length === 0;
    }
}

export { ADTRelationshipsData, ADTRelationshipData };
