import { IAdapterData } from '../../Constants/Interfaces';

export type TsiClientData = any[];
class TsiClientAdapterData implements IAdapterData {
    data: TsiClientData;

    constructor(data: TsiClientData) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data.length === 0;
    }
}

export default TsiClientAdapterData;
