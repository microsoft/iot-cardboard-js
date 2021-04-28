import React from 'react';
import { CardInfo } from '../../Models/Classes/BoardInfo';
import { CardTypes, IADTAdapter, Locale, Theme } from '../../Models/Constants';
import { IBoardProps } from './Board.types';
import { SearchSpan } from '../../Models/Classes';
import { ADTAdapter, IBaseAdapter } from '../../Adapters';
import './Board.scss';

import LinechartCard from '../../Cards/Linechart/Consume/LinechartCard';
import RelationshipsTable from '../../Cards/RelationshipsTable/Consume/RelationshipsTable';
import ADTHierarchyCard from '../../Cards/ADTHierarchyCard/Consume/ADTHierarchyCard';
import KeyValuePairCard from '../../Cards/KeyValuePairCard/Consume/KeyValuePairCard';
import LKVProcessGraphicCard from '../../Cards/LKVProcessGraphicCard/Consume/LKVProcessGraphicCard';
import InfoTableCard from '../../Cards/InfoTableCard/Consume/InfoTableCard';

const Board: React.FC<IBoardProps> = ({ adapter, theme, locale, localeStrings, searchSpan, boardInfo, entitiesInfo }) => { 
    const layoutStyles = boardInfo.layout ? 
    {
        gridTemplateRows: boardInfo.layout?.rows ? '1fr '.repeat(boardInfo.layout.rows) : null ,
        gridTemplateColumns: boardInfo.layout?.columns ? '1fr '.repeat(boardInfo.layout.columns) : null
    } : {};

    const cardComponents = boardInfo.cards.map((card: CardInfo, i: number) => {
        if(entitiesInfo && Object.prototype.hasOwnProperty.call(entitiesInfo, card.key)) {
            card.mergeEntityInfo(entitiesInfo[card.key]);
        }
        const cardElement = getCardElement(card, searchSpan, adapter, theme, locale, localeStrings);
        const cardSizeStyles = {
            gridRow: card.size?.rows ? `span ${card.size.rows}` : null,
            gridColumn: card.size?.columns ? `span ${card.size.columns}` : null
        };

        return <div style={cardSizeStyles} key={`${card.type}-${i}`}>{cardElement}</div>;
    });

    return (
        <div className='cb-board' style={layoutStyles}>{ cardComponents }</div>
    );
}

function getCardElement(
    cardInfo: CardInfo, 
    searchSpan: SearchSpan, 
    adapter: IBaseAdapter, 
    theme: Theme, 
    locale: Locale,
    localeStrings: Record<string, any>) {
    // TODO: In the current asset specific view defintion schema, an asset can specify
    // multiple entities to display. Is that what we want to use? For now, I simply get
    // the first element in the array and use those values instead.
    const entityInfo = cardInfo && Array.isArray(cardInfo.entities)
        ? cardInfo.entities[0]
        : null;

    const pollingIntervalMillis = cardInfo?.cardProperties?.pollingIntervalMillis || 5000;

    // TODO: the names entityInfo and cardInfo.entities are confusing and should be renamed.
    switch(cardInfo.type) {
        case CardTypes.LineChart: return <LinechartCard
            title={cardInfo.title}
            theme={theme}
            adapter={adapter}
            locale={locale}
            id={entityInfo?.id}
            searchSpan={searchSpan}
            properties={entityInfo?.properties}
            adapterAdditionalParameters={{ chartDataOptions: entityInfo?.chartDataOptions }}
            chartDataOptions={entityInfo?.chartDataOptions} />;
        case CardTypes.KeyValuePairCard: return <KeyValuePairCard
            id={entityInfo?.id}
            properties={entityInfo?.properties}
            adapter={adapter}
            pollingIntervalMillis={pollingIntervalMillis} />;
        // TODO: populate the full set of properties.
        case CardTypes.RelationshipsTable: return <RelationshipsTable 
            title={cardInfo.title}
            theme={theme}
            adapter={adapter as ADTAdapter}
            id={entityInfo?.id} />;
        case CardTypes.ADTHierarchyCard: return <ADTHierarchyCard
            title={cardInfo.title}
            adapter={adapter as IADTAdapter} />;
        case CardTypes.LKVProcessGraphicCard: return <LKVProcessGraphicCard
            id={entityInfo?.id}
            title={cardInfo.title}
            properties={entityInfo?.properties}
            imagePropertyPositions={entityInfo?.chartDataOptions?.labelPositions}
            imageSrc={entityInfo?.imageSrc}
            adapterAdditionalParameters={entityInfo?.chartDataOptions?.labelPositions}
            adapter={adapter}
            pollingIntervalMillis={pollingIntervalMillis} />
        case CardTypes.InfoTable: return <InfoTableCard
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
            headers={cardInfo.cardProperties.headers}
            tableRows={entityInfo?.tableRows} />
        // TODO: handle deault case
        default: 
            console.error('Invalid card type', cardInfo.type);
            return null;
    }
}

export default Board;