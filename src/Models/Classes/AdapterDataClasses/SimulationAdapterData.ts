import { IAdapterData } from '../../Constants/Interfaces';

export class SimulationAdapterData implements IAdapterData {
    data: any;

    constructor(data: any) {
        this.data = data;
    }

    hasNoData() {
        return this.data === undefined || this.data === null;
    }
}
