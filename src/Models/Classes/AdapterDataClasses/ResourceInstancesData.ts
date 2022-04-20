import { IAdapterData, IResourceInstance } from '../../Constants/Interfaces';

class ResourceInstancesData implements IAdapterData {
    data: Array<IResourceInstance>;

    constructor(data: Array<IResourceInstance>) {
        this.data = data;
    }

    hasNoData() {
        return !this.data;
    }
}

export default ResourceInstancesData;
