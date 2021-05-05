import CardInfo from './CardInfo';

/**
 * Contains the information that the Board component needs to
 * render a board.
 */
export default class BoardInfo {
    /**
     * The semantic version that defines the shape and contents of the
     * board info object.
     */
    schema: string;

    /**
     * The number of columns and rows of the grid that comprises the board.
     * If no value for columns is specified, the grid will contain a single column.
     * If no value for rows is specified, the grid will auto-generate rows until all cards are displayed.
     * */
    layout?: IBoardLayout;

    /** The cards that the board should display. */
    cards: CardInfo[];

    constructor() {
        this.schema = '1.0.0';
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

interface IBoardLayout {
    rows?: number;
    columns?: number;
}
