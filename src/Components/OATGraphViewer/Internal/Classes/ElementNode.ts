import { ElementData } from './ElementData';
import { ElementPosition } from './ElementPosition';

export class ElementNode {
    public id: string;
    public type: string;
    public position: ElementPosition;
    public data: ElementData;

    constructor(
        id: string,
        type: string,
        position: ElementPosition,
        data: ElementData
    ) {
        this.id = id;
        this.type = type;
        this.position = position;
        this.data = data;
    }
}
