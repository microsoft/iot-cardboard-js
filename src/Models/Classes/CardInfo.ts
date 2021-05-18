import { CardTypes, IEntityInfo } from '../Constants';

/**
 * Contains the information needed to display a single card in a Board component.
 */
export default class CardInfo {
    /**
     * A string that can be used to refer to individual cards within a Board. The value
     * should be unique across all cards of a Board.
     */
    key: string;

    /** The type of card to display. */
    type: CardTypes;

    /** The text to display at the top of the card. */
    title: string;

    /**
     * The number of rows and columns of the Board grid that this card should span.
     * If either value is not specified, it defaults to 1.
     */
    size?: ICardSize;

    /**
     * The list of entities that the card should display. In most cases, there will
     * only be a single entity to display (e.g. a twin in ADT or an device Id in TSI),
     * but there might also be a need to display multiple entities in a single card
     * (e.g. a single line chart that displays data from multiple devices in TSI).
     */
    entities: IEntityInfo[];

    /** A bag of properties used to specify card-level customizations. */
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
}

interface ICardSize {
    rows?: number;
    columns?: number;
}
