// import Utils from 'tsiclient/Utils';

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
            // this.bucketSizeMillis = utils.parseTimeInput(bucketSize);
        }
    }
}
