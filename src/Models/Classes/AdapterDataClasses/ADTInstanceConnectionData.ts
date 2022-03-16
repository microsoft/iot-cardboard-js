import {
    IAdapterData,
    IADTInstanceConnection,
} from '../../Constants/Interfaces';

class ADTInstanceConnectionData implements IAdapterData {
    data: IADTInstanceConnection;

    constructor(data: IADTInstanceConnection) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}

export default ADTInstanceConnectionData;
