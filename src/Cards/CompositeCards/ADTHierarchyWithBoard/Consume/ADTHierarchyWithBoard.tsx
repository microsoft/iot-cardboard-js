import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import useAdapter from '../../../../Models/Hooks/useAdapter';
import BaseCompositeCard from '../../BaseCompositeCard/Consume/BaseCompositeCard';

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
    const lookupTwinIdRef = useRef(lookupTwinId);

    const connectionState = useAdapter({
        adapterMethod: adapter.getConnectionInformation,
        refetchDependencies: [adapter]
    });

    const handleChildNodeClick = (
        _parentNode: IHierarchyNode,
        childNode: IHierarchyNode
    ) => {
        if (
            !(
                reverseLookupTwinId &&
                selectedTwin &&
                reverseLookupTwinId === selectedTwin.$dtId
            )
        ) {
            setSelectedTwin(childNode.nodeData);
            if (onTwinClick) {
                onTwinClick(childNode.nodeData);
            }
        }
    };

    const onEntitySelect = useCallback(
        (
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
                if (lookupTwinIdRef.current) {
                    setReverseLookupTwinId(twin.$dtId);
                }
                if (onTwinClick) {
                    onTwinClick(twin);
                }
                setErrorMessage(null);
            }
        },
        []
    );

    useEffect(() => {
        if (
            lookupTwinId &&
            lookupTwinId !== selectedTwin?.$dtId &&
            lookupTwinId !== reverseLookupTwinId
        ) {
            setReverseLookupTwinId(lookupTwinId);
        }
        lookupTwinIdRef.current = lookupTwinId;
    }, [lookupTwinId]);

    useEffect(() => {
        // resetting state with adapter change
        setSelectedTwin(null);
        setErrorMessage(null);
    }, [adapter]);

    return (
        <div className="cb-hbcard-container">
            <BaseCompositeCard
                theme={theme}
                locale={locale}
                localeStrings={localeStrings}
                isLoading={connectionState.isLoading}
            >
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
            </BaseCompositeCard>
        </div>
    );
};

export default React.memo(ADTHierarchyWithBoard);
