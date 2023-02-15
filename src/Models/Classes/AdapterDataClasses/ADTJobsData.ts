import { IAdapterData, IADTJobs } from '../../Constants/Interfaces';

class ADTJobsData implements IAdapterData {
    data: IADTJobs;

    constructor(data: IADTJobs) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}

export default ADTJobsData;
