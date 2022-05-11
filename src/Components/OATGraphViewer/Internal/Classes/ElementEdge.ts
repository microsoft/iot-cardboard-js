import { ElementEdgeData } from './ElementEdgeData';

export class ElementEdge {
    public id: string;
    public type: string;
    public source: string;
    public sourceHandle: string;
    public target: string;
    public data: ElementEdgeData;

    constructor(
        id: string,
        type: string,
        source: string,
        sourceHandle: string,
        target: string,
        data: ElementEdgeData
    ) {
        this.id = id;
        this.type = type;
        this.source = source;
        this.sourceHandle = sourceHandle;
        this.target = target;
        this.data = data;
    }
}
