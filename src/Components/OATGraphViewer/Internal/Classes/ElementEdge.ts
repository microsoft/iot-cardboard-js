import {
    DtdlInterfaceContent,
    DtdlRelationship,
    IOATRelationshipElement
} from '../../../../Models/Constants';

export class ElementEdge implements IOATRelationshipElement {
    public id: string;
    public label: string;
    public type: string;
    public markerEnd: string;
    public source: string;
    public sourceHandle: string;
    public target: string;
    public targetHandle: string;
    public data: DtdlRelationship | DtdlInterfaceContent;

    constructor(
        id: string,
        label: string,
        type: string,
        markerEnd: string,
        source: string,
        sourceHandle: string,
        target: string,
        targetHandle: string,
        data: DtdlRelationship | DtdlInterfaceContent
    ) {
        this.id = id;
        this.label = label;
        this.type = type;
        this.markerEnd = markerEnd;
        this.source = source;
        this.sourceHandle = sourceHandle;
        this.target = target;
        this.targetHandle = targetHandle;
        this.data = data;
    }
}
