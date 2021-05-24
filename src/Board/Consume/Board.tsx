import React from 'react';
import { ThemeProvider } from '../../Theming/ThemeProvider';
import I18nProviderWrapper from '../../Models/Classes/I18NProviderWrapper';
import i18n from '../../i18n';
import { useTranslation } from 'react-i18next';
import {
    CardTypes,
    IADTAdapter,
    IADTTwin,
    IADTModel,
    IResolvedRelationshipClickErrors,
    Locale,
    Theme,
    CardErrorType,
    ViewDataPropertyName
} from '../../Models/Constants';
import { IBoardProps } from './Board.types';
import {
    SearchSpan,
    CardInfo,
    CardError,
    BoardInfo
} from '../../Models/Classes';
import { ADTAdapter, IBaseAdapter } from '../../Adapters';
import {
    LineChartCard,
    RelationshipsTable,
    ADTHierarchyCard,
    KeyValuePairCard,
    LKVProcessGraphicCard,
    InfoTableCard
} from '../../Cards';
import BaseCard from '../../Cards/Base/Consume/BaseCard';
import './Board.scss';

const Board: React.FC<IBoardProps> = ({
    adapter,
    theme,
    locale,
    localeStrings,
    searchSpan,
    boardInfo,
    adtTwin,
    errorMessage,
    onEntitySelect
}) => {
    const { t } = useTranslation();
    let layoutStyles = {};
    let cardComponents = [];

    // If no board info prop was provided, but a twin was, extract the
    // board info from the twin.
    if (!boardInfo && adtTwin) {
        const boardInfoObject = adtTwin?.[ViewDataPropertyName]?.boardInfo
            ? JSON.parse(adtTwin[ViewDataPropertyName]?.boardInfo)
            : null;

        boardInfo =
            boardInfoObject === null
                ? getDefaultBoardInfo(adtTwin, t)
                : BoardInfo.fromObject(boardInfoObject);
    }

    if (boardInfo) {
        layoutStyles = boardInfo.layout
            ? {
                  gridTemplateRows: boardInfo.layout?.numRows
                      ? '1fr '.repeat(boardInfo.layout.numRows)
                      : null,
                  gridTemplateColumns: boardInfo.layout?.numColumns
                      ? '1fr '.repeat(boardInfo.layout.numColumns)
                      : null
              }
            : {};

        cardComponents = boardInfo.cards.map((card: CardInfo, i: number) => {
            const cardElement = getCardElement(
                card,
                searchSpan,
                adapter,
                theme,
                locale,
                localeStrings,
                onEntitySelect
            );
            const cardSizeStyles = {
                gridRow: card.size?.rows ? `span ${card.size.rows}` : null,
                gridColumn: card.size?.columns
                    ? `span ${card.size.columns}`
                    : null
            };

            return (
                <div style={cardSizeStyles} key={`${card.type}-${i}`}>
                    {cardElement}
                </div>
            );
        });
    }

    return (
        <I18nProviderWrapper
            locale={locale}
            localeStrings={localeStrings}
            i18n={i18n}
        >
            <ThemeProvider theme={theme}>
                {errorMessage && (
                    <div className="cb-base-catastrophic-error-wrapper">
                        <div className="cb-base-catastrophic-error-box">
                            <div className="cb-base-catastrophic-error-message">
                                {errorMessage}
                            </div>
                        </div>
                    </div>
                )}
                {!errorMessage && cardComponents.length === 0 && (
                    <div className="cb-base-catastrophic-error-wrapper">
                        <div className="cb-base-catastrophic-error-box">
                            <div className="cb-base-catastrophic-error-message">
                                {t('board.empty')}
                            </div>
                        </div>
                    </div>
                )}
                {!errorMessage && cardComponents.length > 0 && (
                    <div className="cb-board" style={layoutStyles}>
                        {cardComponents}
                    </div>
                )}
            </ThemeProvider>
        </I18nProviderWrapper>
    );
};

function getCardElement(
    cardInfo: CardInfo,
    searchSpan: SearchSpan,
    adapter: IBaseAdapter,
    theme: Theme,
    locale: Locale,
    localeStrings: Record<string, any>,
    onEntitySelect: (
        twin: IADTTwin,
        model: IADTModel,
        errors?: IResolvedRelationshipClickErrors
    ) => void
) {
    // TODO: In the current asset specific view defintion schema, an asset can specify
    // multiple entities to display. Is that what we want to use? For now, I simply get
    // the first element in the array and use those values instead.
    const entityInfo =
        cardInfo && Array.isArray(cardInfo.entities)
            ? cardInfo.entities[0]
            : null;

    const pollingIntervalMillis =
        cardInfo?.cardProperties?.pollingIntervalMillis || 5000;

    switch (cardInfo.type) {
        case CardTypes.LineChart:
            return (
                <LineChartCard
                    title={cardInfo.title}
                    theme={theme}
                    adapter={adapter}
                    locale={locale}
                    id={entityInfo?.id}
                    searchSpan={searchSpan}
                    properties={entityInfo?.properties}
                    adapterAdditionalParameters={{
                        chartDataOptions: entityInfo?.chartDataOptions
                    }}
                    chartDataOptions={entityInfo?.chartDataOptions}
                />
            );
        case CardTypes.KeyValuePairCard:
            return (
                <KeyValuePairCard
                    id={entityInfo?.id}
                    properties={entityInfo?.properties}
                    adapter={adapter}
                    pollingIntervalMillis={pollingIntervalMillis}
                />
            );
        case CardTypes.RelationshipsTable:
            return (
                <RelationshipsTable
                    title={cardInfo.title}
                    theme={theme}
                    adapter={adapter as ADTAdapter}
                    id={entityInfo?.id}
                    onRelationshipClick={onEntitySelect}
                />
            );
        case CardTypes.ADTHierarchyCard:
            return (
                <ADTHierarchyCard
                    title={cardInfo.title}
                    adapter={adapter as IADTAdapter}
                />
            );
        case CardTypes.LKVProcessGraphicCard:
            return (
                <LKVProcessGraphicCard
                    id={entityInfo?.id}
                    title={cardInfo.title}
                    properties={entityInfo?.properties}
                    imagePropertyPositions={
                        entityInfo?.chartDataOptions?.labelPositions
                    }
                    imageSrc={entityInfo?.imageSrc}
                    adapterAdditionalParameters={
                        entityInfo?.chartDataOptions?.labelPositions
                    }
                    adapter={adapter}
                    pollingIntervalMillis={pollingIntervalMillis}
                />
            );
        case CardTypes.InfoTable:
            return (
                <InfoTableCard
                    theme={theme}
                    locale={locale}
                    localeStrings={localeStrings}
                    headers={cardInfo.cardProperties.headers}
                    tableRows={entityInfo?.tableRows}
                />
            );
        default:
            return (
                <BaseCard
                    isLoading={false}
                    adapterResult={null}
                    cardError={
                        new CardError({
                            type: CardErrorType.InvalidCardType,
                            messageParams: { cardType: cardInfo.type }
                        })
                    }
                />
            );
    }
}

function getDefaultBoardInfo(
    dtTwin: IADTTwin,
    t: (str: string) => string
): BoardInfo {
    const board = new BoardInfo();
    board.layout = { numColumns: 3 };

    // Filter metadata properties.
    const propertiesToIgnore = [ViewDataPropertyName];
    const twinProperties = Object.keys(dtTwin)
        .filter((key) => key[0] !== '$' && !propertiesToIgnore.includes(key))
        .reduce((obj, key) => {
            obj[key] = dtTwin[key];
            return obj;
        }, {});

    board.cards.push(
        CardInfo.fromObject({
            key: 'infoTable',
            type: CardTypes.InfoTable,
            size: { rows: 1, columns: 3 },
            cardProperties: {
                headers: [t('board.twinID'), t('board.model')]
            },
            entities: [
                {
                    tableRows: [[dtTwin.$dtId, dtTwin.$metadata.$model]]
                }
            ]
        })
    );

    board.cards.push(
        CardInfo.fromObject({
            key: 'relationships',
            type: CardTypes.RelationshipsTable,
            title: t('board.relationshipsTable'),
            size: { rows: 4, columns: 2 },
            entities: [{ id: dtTwin.$dtId }]
        })
    );

    const propertyCards = Object.keys(twinProperties).map((name: string) => {
        const cardInfo = CardInfo.fromObject({
            key: `property-${name}`,
            type: CardTypes.KeyValuePairCard,
            size: { rows: 2 },
            cardProperties: { pollingIntervalMillis: 5000 },
            entities: [{ id: dtTwin.$dtId, properties: [name] }]
        });

        return cardInfo;
    });

    board.cards = [...board.cards, ...propertyCards];

    return board;
}

export default Board;
