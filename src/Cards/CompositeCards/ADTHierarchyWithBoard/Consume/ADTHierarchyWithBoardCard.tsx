import React, { useState } from 'react';
import { ADTHierarchyWithBoardCardProps } from './ADTHierarchyWithBoardCard.types';
import ADTHierarchyCard from '../../../ADTHierarchyCard/Consume/ADTHierarchyCard';
import Board from '../../../../Board/Consume/Board';
import { IHierarchyNode, IViewData, IADTTwin } from '../../../../Models/Constants/Interfaces';
import { ViewDataPropertyName } from '../../../../Models/Constants/Constants';
import { useTranslation } from 'react-i18next';
import './ADTHierarchyWithBoardCard.scss';
import { BoardInfo, CardInfo } from '../../../../Models/Classes/BoardInfo';
import { CardTypes } from '../../../../Models/Constants';

const ADTHierarchyWithBoardCard: React.FC<ADTHierarchyWithBoardCardProps> = ({
    title,
    adapter,
    theme,
    locale,
    localeStrings
}) => {
    const [selectedChildNode, setSelectedChildNode]: [IHierarchyNode, React.Dispatch<IHierarchyNode>] = useState(null);
    const { t } = useTranslation();
    let boardInfo: BoardInfo = null;
    let viewDefinition: IViewData = null;

    const handleChildNodeClick = (
        _parentNode: IHierarchyNode,
        childNode: IHierarchyNode
    ) => {
        setSelectedChildNode(childNode);
    };

    if(selectedChildNode !== null) {
        // TODO: viewData.viewDefintion currently has the view definition inline, but it might be better to 
        // have it be a URL that we use to fetch the definition.
        viewDefinition = selectedChildNode?.nodeData?.[ViewDataPropertyName]?.boardInfo
            ? JSON.parse(selectedChildNode?.nodeData?.[ViewDataPropertyName]?.boardInfo)
            : null;
        boardInfo = viewDefinition === null
            ? getDefaultBoardInfo(selectedChildNode.nodeData)
            : BoardInfo.fromObject(viewDefinition);
    }

    return (
        <div className='cb-hbcard-container'>
            <div className='cb-hbcard-hierarchy'>
                <ADTHierarchyCard
                    adapter={adapter}
                    title={title || t('hierarchy')}
                    theme={theme}
                    locale={locale}
                    localeStrings={localeStrings}
                    onChildNodeClick={handleChildNodeClick}
                />
            </div>
            <div className='cb-hbcard-board'>
                {boardInfo && (
                    <Board
                        theme={theme}
                        locale={locale}
                        boardInfo={boardInfo}
                        adapter={adapter}
                    />
                )}
            </div>
        </div>
    );
};

function getDefaultBoardInfo(dtTwin: IADTTwin): BoardInfo {
    const board = new BoardInfo();
    board.layout = { columns: 3 };

    // Filter metadata properties.
    // TODO: Remove img_src and img_propertyPositions
    const propertiesToIgnore = [ViewDataPropertyName, "img_src", "img_propertyPositions"];
    const twinProperties = Object.keys(dtTwin)
        .filter(key => key[0] !== "$" && !propertiesToIgnore.includes(key))
        .reduce((obj, key) => {
            obj[key] = dtTwin[key];
            return obj;
        }, {});

    board.cards.push(CardInfo.fromObject({
        key: "infoTable",
        type: CardTypes.InfoTable,
        size: { rows: 1, columns: 3 },
        cardProperties: {
            // TODO: localize
            headers: ['Twin Name', 'Model ID']
        },
        entities: [
            {
                tableRows: [[dtTwin.$dtId, dtTwin.$metadata.$model]]
            }
        ]
    }));

    board.cards.push(CardInfo.fromObject({
        key: "relationships",
        type: CardTypes.RelationshipsTable,
        // TODO: localize
        title: "Relationships Table",
        size: { rows: 4, columns: 2 },
        entities: [ { id: dtTwin.$dtId }]
    }));

    const propertyCards = Object.keys(twinProperties).map((name: string) => {
        const cardInfo = CardInfo.fromObject({
            key: `property-${name}`,
            type: CardTypes.KeyValuePairCard,
            size: { rows: 2 },
            cardProperties: { pollingIntervalMillis: 5000 },
            entities: [ { id: dtTwin.$dtId, properties: [name] } ]
        });

        return cardInfo;
    });

    board.cards = [...board.cards, ...propertyCards];

    return board;
}

export default React.memo(ADTHierarchyWithBoardCard);
