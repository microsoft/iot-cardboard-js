import React, { useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import {
    CardTypes,
    IADTAdapter,
    IADTTwin,
    IADTModel,
    IResolvedRelationshipClickErrors,
    Locale,
    Theme,
    ComponentErrorType,
    ADTModel_ViewData_PropertyName,
    ADTModel_ImgSrc_PropertyName,
    ADTModel_ImgPropertyPositions_PropertyName,
    AdapterTypes,
    ITsiClientChartDataAdapter,
    IKeyValuePairAdapter
} from '../../Models/Constants';
import { IBoardProps } from './Board.types';
import {
    SearchSpan,
    CardInfo,
    ComponentError,
    BoardInfo
} from '../../Models/Classes';
import { ADTAdapter } from '../../Adapters';
import {
    LineChartCard,
    RelationshipsTable,
    ADTHierarchyCard,
    KeyValuePairCard,
    LKVProcessGraphicCard,
    InfoTableCard
} from '../../Cards';
import BaseCard from '../../Cards/Base/Consume/BaseCard';
import { hasAllProcessGraphicsCardProperties } from '../../Models/Services/Utils';
import './Board.scss';
import PropertyInspectorSurface from '../../Components/PropertyInspector/surface/PropertyInspectorSurface';
import BaseComponent from '../../Components/BaseComponent/BaseComponent';

const Board: React.FC<IBoardProps> = ({
    adapter,
    theme,
    locale,
    localeStrings,
    searchSpan,
    boardInfo,
    adtTwin,
    errorMessage,
    onEntitySelect,
    hasDataHistory = false
}) => {
    const { t } = useTranslation();
    const [isInspectorOpen, setIsInspectorOpen] = useState(false);

    let layoutStyles = {};
    let cardComponents = [];

    // If no board info prop was provided, but a twin was, extract the
    // board info from the twin.
    if (!boardInfo && adtTwin) {
        const boardInfoObject = adtTwin?.[ADTModel_ViewData_PropertyName]
            ?.boardInfo
            ? JSON.parse(adtTwin[ADTModel_ViewData_PropertyName]?.boardInfo)
            : null;

        boardInfo =
            boardInfoObject === null
                ? getDefaultBoardInfo(adtTwin, t, searchSpan, hasDataHistory)
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
            // if searchSpan is not provided set it to last 7 days
            const defaultSearchSpanTo = new Date();
            const defaultSearchSpanFrom = new Date();
            defaultSearchSpanFrom.setDate(defaultSearchSpanFrom.getDate() - 7);
            searchSpan =
                searchSpan ??
                new SearchSpan(
                    defaultSearchSpanFrom,
                    defaultSearchSpanTo,
                    '6h'
                );

            const cardElement = getCardElement(
                card,
                searchSpan,
                adapter,
                theme,
                locale,
                localeStrings,
                onEntitySelect,
                setIsInspectorOpen,
                t
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
        <BaseComponent
            locale={locale}
            localeStrings={localeStrings}
            theme={theme}
        >
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
            {adtTwin && (
                <PropertyInspectorSurface
                    isOpen={isInspectorOpen}
                    onDismiss={() => setIsInspectorOpen(false)}
                    twinId={adtTwin['$dtId']}
                    adapter={adapter as IADTAdapter}
                    theme={theme}
                    locale={locale}
                />
            )}
        </BaseComponent>
    );
};

// if search span is not provided pull data history for the last 7 days
function getCardElement(
    cardInfo: CardInfo,
    searchSpan: SearchSpan,
    adapter: AdapterTypes,
    theme: Theme,
    locale: Locale,
    localeStrings: Record<string, any>,
    onEntitySelect: (
        twin: IADTTwin,
        model: IADTModel,
        errors?: IResolvedRelationshipClickErrors
    ) => void,
    setIsInspectorOpen,
    t: TFunction<string>
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
                    adapter={adapter as ITsiClientChartDataAdapter}
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
                    theme={theme}
                    properties={entityInfo?.properties}
                    adapter={adapter as IKeyValuePairAdapter}
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
                    theme={theme}
                />
            );
        case CardTypes.LKVProcessGraphicCard:
            return (
                <LKVProcessGraphicCard
                    id={entityInfo?.id}
                    title={cardInfo.title}
                    theme={theme}
                    properties={entityInfo?.properties}
                    imagePropertyPositions={
                        entityInfo?.chartDataOptions?.labelPositions
                    }
                    imageSrc={entityInfo?.imageSrc}
                    adapterAdditionalParameters={
                        entityInfo?.chartDataOptions?.labelPositions
                    }
                    adapter={adapter as IKeyValuePairAdapter}
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
                    infoTableActionButtonProps={{
                        label: t('editTwin'),
                        onClick: () => setIsInspectorOpen(true)
                    }}
                />
            );
        default:
            return (
                <BaseCard
                    theme={theme}
                    isLoading={false}
                    adapterResult={null}
                    cardError={
                        new ComponentError({
                            type: ComponentErrorType.InvalidCardType,
                            messageParams: { cardType: cardInfo.type }
                        })
                    }
                />
            );
    }
}

function getDefaultBoardInfo(
    dtTwin: IADTTwin,
    t: (str: string) => string,
    searchSpan?: SearchSpan,
    hasDataHistory?: boolean
): BoardInfo {
    const board = new BoardInfo();
    board.layout = { numColumns: 3 };

    // Filter metadata properties.
    const propertiesToIgnore = [ADTModel_ViewData_PropertyName];
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
                headers: [t('board.twinID'), t('board.model')],
                twinId: dtTwin['$dtId']
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

    const propertyCards = Object.keys(twinProperties).map((name: string) =>
        CardInfo.fromObject({
            key: `property-${name}`,
            type: CardTypes.KeyValuePairCard,
            size: { rows: 2 },
            cardProperties: { pollingIntervalMillis: 5000 },
            entities: [{ id: dtTwin.$dtId, properties: [name] }]
        })
    );

    const dataHistory = CardInfo.fromObject({
        key: `historized-data`,
        title: `${t('board.dataHistory')}${
            searchSpan ? '' : ', ' + t('board.last7days')
        }`,
        type: CardTypes.LineChart,
        size: { rows: 3, columns: 3 },
        cardProperties: { pollingIntervalMillis: 5000 },
        entities: [
            { id: dtTwin.$dtId, properties: Object.keys(twinProperties) }
        ]
    });

    if (hasAllProcessGraphicsCardProperties(dtTwin)) {
        board.cards.push(
            CardInfo.fromObject({
                key: `lkv-process-graphic`,
                title: t('board.processGraphic'),
                type: CardTypes.LKVProcessGraphicCard,
                size: { rows: 2 },
                cardProperties: { pollingIntervalMillis: 5000 },
                entities: [
                    {
                        id: dtTwin.$dtId,
                        properties: Object.keys(twinProperties),
                        imageSrc:
                            dtTwin[ADTModel_ViewData_PropertyName][
                                ADTModel_ImgSrc_PropertyName
                            ],
                        chartDataOptions: {
                            labelPositions: JSON.parse(
                                dtTwin[ADTModel_ViewData_PropertyName][
                                    ADTModel_ImgPropertyPositions_PropertyName
                                ]
                            )
                        }
                    }
                ]
            })
        );
    }

    board.cards = hasDataHistory
        ? [...board.cards, ...propertyCards, dataHistory]
        : [...board.cards, ...propertyCards];

    return board;
}

export default React.memo(Board);
