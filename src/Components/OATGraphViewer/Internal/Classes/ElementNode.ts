import { DtdlInterface, IOATNodeElement } from '../../../../Models/Constants';
import { ElementPosition } from './ElementPosition';

export class ElementNode implements IOATNodeElement {
    public id: string;
    public type: string;
    public position: ElementPosition;
    public data: DtdlInterface;

    constructor(
        id: string,
        type: string,
        position: ElementPosition,
        data: DtdlInterface
    ) {
        this.id = id;
        this.type = type;
        this.position = position;
        this.data = data;
    }
}
