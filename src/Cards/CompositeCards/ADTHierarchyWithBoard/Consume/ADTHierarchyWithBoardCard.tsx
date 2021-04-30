import React, { useState } from 'react';
import { ADTHierarchyWithBoardCardProps } from './ADTHierarchyWithBoardCard.types';
import ADTHierarchyCard from '../../../ADTHierarchyCard/Consume/ADTHierarchyCard';
import Board from '../../../../Board/Consume/Board';
import { IHierarchyNode, IADTTwin, IADTModel, IResolvedRelationshipClickErrors } from '../../../../Models/Constants/Interfaces';
import { ViewDataPropertyName } from '../../../../Models/Constants/Constants';
import { useTranslation } from 'react-i18next';
import { BoardInfo, CardInfo } from '../../../../Models/Classes/BoardInfo';
import { CardTypes } from '../../../../Models/Constants';
import './ADTHierarchyWithBoardCard.scss';

const ADTHierarchyWithBoardCard: React.FC<ADTHierarchyWithBoardCardProps> = ({
    title,
    adapter,
    theme,
    locale,
    localeStrings
}) => {
    const [boardInfo, setBoardInfo]: [BoardInfo, React.Dispatch<BoardInfo>] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const { t } = useTranslation();

    const handleChildNodeClick = (
        _parentNode: IHierarchyNode,
        childNode: IHierarchyNode
    ) => {
        setBoardInfo(getBoardInfo(childNode.nodeData));
    };

    const onEntitySelect = (twin: IADTTwin, model: IADTModel, errors?: IResolvedRelationshipClickErrors) => {
        if(errors.twinErrors || errors.modelErrors) {
            setBoardInfo(null);
            setErrorMessage(t('board.failure'));
            console.error(errors.modelErrors);
            console.error(errors.twinErrors);
        } else {
            setBoardInfo(getBoardInfo(twin));
            setErrorMessage(null);
        }
    };

    const getBoardInfo = (twin: IADTTwin) => {
        const boardInfoObject = twin?.cb_viewdata?.boardInfo 
            ? JSON.parse(twin.cb_viewdata?.boardInfo) 
            : null;
        return boardInfoObject === null
            ? getDefaultBoardInfo(twin, t)
            : BoardInfo.fromObject(boardInfoObject)
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
                        errorMessage={errorMessage}
                        onEntitySelect={onEntitySelect}
                    />
                )}
            </div>
        </div>
    );
};

function getDefaultBoardInfo(dtTwin: IADTTwin, t: (str: string) => string): BoardInfo {
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
            headers: [t('board.twinID'), t('board.model')]
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
        title: t('board.relationshipsTable'),
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
