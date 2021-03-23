import { IAdapterData } from '../../Constants/Interfaces';
import { HierarchyData } from '../../Constants/Types';

class HierarchyAdapterData implements IAdapterData {
    data: HierarchyData;

    constructor(data: HierarchyData) {
        this.data = data;
    }

    hasNoData() {
        // hierarchy can be either rendered by the adapter itself with data undefined or adapter return hierarchy data
        return this.data && Object.keys(this.data).length === 0;
    }
}

export default HierarchyAdapterData;
