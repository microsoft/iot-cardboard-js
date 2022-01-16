import { IAdapterData } from '../../Constants/Interfaces';
import { IBehavior } from '../3DVConfig';

class ViewConfigBehaviorData implements IAdapterData {
    data: IBehavior;

    constructor(data: IBehavior) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}

export default ViewConfigBehaviorData;
