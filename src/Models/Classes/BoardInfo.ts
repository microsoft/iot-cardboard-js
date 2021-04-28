export class BoardInfo {
    schema: string;
    layout?: IBoardLayout;
    cards: CardInfo[];

    constructor() {
        this.schema = "1.0.0";
        this.cards = [];
    }

    // TODO: Need to add validation and type checking once we've finalized asset specific
    // view schema
    static fromObject(obj: any): BoardInfo {
        const boardInfo = new BoardInfo();
        boardInfo.schema = obj.schema;
       
        boardInfo.layout = {
            rows: obj.layout.rows,
            columns: obj.layout.columns
        };

        boardInfo.cards = obj.cards;

        return boardInfo;
    }
}

export interface IBoardLayout {
    rows?: number;
    columns?: number;
}

export class CardInfo {
    key: string;
    type: string;
    title: string;
    size?: ICardSize;
    entities: IEntityInfo[];
    cardProperties?: { [key: string]: any };

    constructor() {
        this.entities = [];
    }

    // TODO: Need to add validation and type checking once we've finalized asset specific
    // view schema
    static fromObject(obj: any): CardInfo {
        const cardInfo = obj;
        return cardInfo;
    }

    mergeEntityInfo(entityInfo: IEntityInfo) {
        this.entities = {
            ...this.entities,
            ...entityInfo
        };
    }
}

export interface ICardSize {
    rows?: number;
    columns?: number;
}

export interface IEntityInfo {
    id: string;
    properties: any;
    chartDataOptions?: any;
    [key: string]: any;
}