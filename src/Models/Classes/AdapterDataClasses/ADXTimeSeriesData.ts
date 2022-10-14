import { IAdapterData } from '../../Constants/Interfaces';
import { ADXTimeSeries } from '../../Constants/Types';

class ADXTimeSeriesData implements IAdapterData {
    data: Array<ADXTimeSeries>;

    constructor(data: Array<ADXTimeSeries>) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data.length === 0;
    }
}

export default ADXTimeSeriesData;
