import { IOATTwinNodeContents } from '../../../../Models/Constants';

export class ElementData {
    public id: string;
    public name: string;
    public type: string;
    public content: IOATTwinNodeContents[];
    public context: string;

    constructor(
        id: string,
        name: string,
        type: string,
        content: IOATTwinNodeContents[],
        context: string
    ) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.content = content;
        this.context = context;
    }
}
