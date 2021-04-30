import React from 'react';
import { ThemeProvider } from '../../Theming/ThemeProvider';
import I18nProviderWrapper from '../../Models/Classes/I18NProviderWrapper';
import i18n from '../../i18n';
import { useTranslation } from 'react-i18next';
import { CardInfo } from '../../Models/Classes/BoardInfo';
import { CardTypes, IADTAdapter, IADTTwin, IADTModel, IResolvedRelationshipClickErrors, Locale, Theme } from '../../Models/Constants';
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

const Board: React.FC<IBoardProps> = ({ 
    adapter, 
    theme, 
    locale, 
    localeStrings, 
    searchSpan, 
    boardInfo, 
    entitiesOverride,
    errorMessage,
    onEntitySelect }) => {
    const { t } = useTranslation();
    let layoutStyles = {};
    let cardComponents = [];

    if(boardInfo !== null) {
        layoutStyles = boardInfo.layout ? 
        {
            gridTemplateRows: boardInfo.layout?.rows ? '1fr '.repeat(boardInfo.layout.rows) : null ,
            gridTemplateColumns: boardInfo.layout?.columns ? '1fr '.repeat(boardInfo.layout.columns) : null
        } : {};

        cardComponents = boardInfo.cards.map((card: CardInfo, i: number) => {
            if(entitiesOverride && Object.prototype.hasOwnProperty.call(entitiesOverride, card.key)) {
                card.mergeEntityInfo(entitiesOverride[card.key]);
            }

            const cardElement = getCardElement(card, searchSpan, adapter, theme, locale, localeStrings, onEntitySelect);
            const cardSizeStyles = {
                gridRow: card.size?.rows ? `span ${card.size.rows}` : null,
                gridColumn: card.size?.columns ? `span ${card.size.columns}` : null
            };
    
            return <div style={cardSizeStyles} key={`${card.type}-${i}`}>{cardElement}</div>;
        });
    }

    return (
        <I18nProviderWrapper
            locale={locale}
            localeStrings={localeStrings}
            i18n={i18n}
        >
            <ThemeProvider theme={theme}>
                { errorMessage && 
                    <div className="cb-base-catastrophic-error-wrapper">
                        <div className="cb-base-catastrophic-error-box">
                            <div className="cb-base-catastrophic-error-message">
                                {errorMessage}
                            </div>
                        </div>
                    </div> }
                { (!errorMessage && cardComponents.length === 0) &&
                    <div className="cb-base-catastrophic-error-wrapper">
                        <div className="cb-base-catastrophic-error-box">
                            <div className="cb-base-catastrophic-error-message">
                                {t('board.empty')}
                            </div>
                        </div>
                    </div> }
                { (!errorMessage && cardComponents.length > 0) &&
                    <div className='cb-board' style={layoutStyles}>{cardComponents}</div> }
            </ThemeProvider>
        </I18nProviderWrapper>
    );
}

function getCardElement(
    cardInfo: CardInfo, 
    searchSpan: SearchSpan, 
    adapter: IBaseAdapter, 
    theme: Theme, 
    locale: Locale,
    localeStrings: Record<string, any>,
    onEntitySelect: (twin: IADTTwin, model: IADTModel, errors?: IResolvedRelationshipClickErrors) => void) {
    // TODO: In the current asset specific view defintion schema, an asset can specify
    // multiple entities to display. Is that what we want to use? For now, I simply get
    // the first element in the array and use those values instead.
    const entityInfo = cardInfo && Array.isArray(cardInfo.entities)
        ? cardInfo.entities[0]
        : null;

    const pollingIntervalMillis = cardInfo?.cardProperties?.pollingIntervalMillis || 5000;

    // TODO: some of these components don't pass the full list of props. Determine
    // which props should still be passed.
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
        case CardTypes.RelationshipsTable: return <RelationshipsTable 
            title={cardInfo.title}
            theme={theme}
            adapter={adapter as ADTAdapter}
            id={entityInfo?.id} 
            onRelationshipClick={onEntitySelect} />;
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