import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ADTHierarchyWithBoardProps } from './ADTHierarchyWithBoard.types';
import ADTHierarchyCard from '../../../ADTHierarchyCard/Consume/ADTHierarchyCard';
import Board from '../../../../Board/Consume/Board';
import {
    IHierarchyNode,
    IADTTwin,
    IADTModel,
    IResolvedRelationshipClickErrors
} from '../../../../Models/Constants/Interfaces';
import './ADTHierarchyWithBoard.scss';

const ADTHierarchyWithBoard: React.FC<ADTHierarchyWithBoardProps> = ({
    title,
    adapter,
    theme,
    locale,
    localeStrings,
    lookupTwinId,
    onTwinClick
}) => {
    const [selectedTwin, setSelectedTwin]: [
        IADTTwin,
        React.Dispatch<IADTTwin>
    ] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [reverseLookupTwinId, setReverseLookupTwinId] = useState(
        lookupTwinId
    );
    const { t } = useTranslation();

    const handleChildNodeClick = (
        _parentNode: IHierarchyNode,
        childNode: IHierarchyNode
    ) => {
        setSelectedTwin(childNode.nodeData);
        if (onTwinClick) {
            onTwinClick(childNode.nodeData);
        }
    };

    const onEntitySelect = (
        twin: IADTTwin,
        _model: IADTModel,
        errors?: IResolvedRelationshipClickErrors
    ) => {
        if (errors.twinErrors || errors.modelErrors) {
            setSelectedTwin(null);
            if (onTwinClick) {
                onTwinClick(null);
            }
            setErrorMessage(t('boardErrors.failure'));
            console.error(errors.modelErrors);
            console.error(errors.twinErrors);
        } else {
            setSelectedTwin(twin);
            if (onTwinClick) {
                onTwinClick(twin);
            }
            setErrorMessage(null);
            setReverseLookupTwinId(twin.$dtId);
        }
    };

    return (
        <div className="cb-hbcard-container">
            <div className="cb-hbcard-hierarchy">
                <ADTHierarchyCard
                    adapter={adapter}
                    title={title || t('hierarchy')}
                    theme={theme}
                    locale={locale}
                    localeStrings={localeStrings}
                    onChildNodeClick={handleChildNodeClick}
                    lookupTwinId={reverseLookupTwinId}
                />
            </div>
            <div className="cb-hbcard-board">
                {selectedTwin && (
                    <Board
                        theme={theme}
                        locale={locale}
                        adtTwin={selectedTwin}
                        adapter={adapter}
                        errorMessage={errorMessage}
                        onEntitySelect={onEntitySelect}
                    />
                )}
            </div>
        </div>
    );
};

export default React.memo(ADTHierarchyWithBoard);
