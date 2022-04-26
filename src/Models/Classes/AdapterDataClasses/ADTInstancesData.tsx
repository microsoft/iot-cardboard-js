import { IAdapterData, IAzureResource } from '../../Constants/Interfaces';

class ADTInstancesData implements IAdapterData {
    data: Array<IAzureResource>;

    constructor(data: Array<IAzureResource>) {
        this.data = data;
    }

    hasNoData() {
        return !this.data;
    }
}

export default ADTInstancesData;
