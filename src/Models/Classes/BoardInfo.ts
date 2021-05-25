import CardInfo from './CardInfo';

/**
 * Contains the information that the Board component needs to
 * render a board.
 */
export default class BoardInfo {
    /**
     * The semantic version that defines the shape and contents of the
     * board info object. The version is specified as 'MAJOR.MINOR' where
     * MAJOR is used when introducing breaking changes.
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
        this.schema = '1.0';
        this.cards = [];
    }

    // TODO: Need to add validation and type checking once we've finalized asset specific
    // view schema
    static fromObject(obj: any): BoardInfo {
        const boardInfo = new BoardInfo();
        boardInfo.schema = obj.schema;

        boardInfo.layout = {
            numRows: obj.layout.numRows,
            numColumns: obj.layout.numColumns
        };

        boardInfo.cards = obj.cards;

        return boardInfo;
    }
}

interface IBoardLayout {
    numRows?: number;
    numColumns?: number;
}
