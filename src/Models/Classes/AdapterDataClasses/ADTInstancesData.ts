import { IAdapterData, IADTInstance } from '../../Constants/Interfaces';

class ADTInstancesData implements IAdapterData {
    data: Array<IADTInstance>;

    constructor(data: Array<IADTInstance>) {
        this.data = data;
    }

    hasNoData() {
        return (
            this.data === null ||
            this.data === undefined ||
            this.data.length === 0
        );
    }
}

export default ADTInstancesData;
