import { IAdapterData, IAdtApiJob } from '../../Constants/Interfaces';

class ADTJobsData implements IAdapterData {
    data: IAdtApiJob[];

    constructor(data: IAdtApiJob[]) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data.length === 0;
    }
}

class ADTJobData implements IAdapterData {
    data: IAdtApiJob;

    constructor(data: IAdtApiJob) {
        this.data = data;
    }

    hasNoData() {
        return this.data === null || this.data === undefined;
    }
}

export { ADTJobsData, ADTJobData };
