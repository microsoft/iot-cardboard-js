import { IAdapterData, IADXConnection } from '../../Constants/Interfaces';

class ADTInstanceConnectionData implements IAdapterData {
    data: IADXConnection;

    constructor(data: IADXConnection) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}

export default ADTInstanceConnectionData;
