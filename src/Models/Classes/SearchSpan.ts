import Utils from 'tsiclient/Utils';

export class SearchSpan {
    public from: Date;
    public to: Date;
    public bucketSize: string;
    public bucketSizeMillis: number;

    constructor(from: Date, to: Date, bucketSize: string = null) {
        this.from = from;
        this.to = to;
        this.bucketSize = bucketSize;
        if (bucketSize) {
            this.bucketSizeMillis = Utils.parseTimeInput(bucketSize);
        }
    }
}

const mockedStartDate = 1617260400000;

export const mockedSearchSpan = new SearchSpan(
    new Date(mockedStartDate),
    new Date(mockedStartDate + 100000),
    '100ms'
);
