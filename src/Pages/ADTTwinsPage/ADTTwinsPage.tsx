import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { ADTTwinsPageProps } from './ADTTwinsPage.types';
import {
    IHierarchyNode,
    IADTTwin,
    IADTModel,
    IResolvedRelationshipClickErrors,
    IADXConnection
} from '../../Models/Constants/Interfaces';
import './ADTTwinsPage.scss';
import useAdapter from '../../Models/Hooks/useAdapter';
import { BaseCompositeCard, ADTHierarchyCard } from '../..';
import Board from '../../Components/Board/Board';

const ADTTwinsPage: React.FC<ADTTwinsPageProps> = ({
    title,
    adapter,
    theme,
    locale,
    localeStrings,
    lookupTwinId,
    onTwinClick,
    searchSpanForDataHistory
}) => {
    const [selectedTwin, setSelectedTwin]: [
        IADTTwin,
        React.Dispatch<IADTTwin>
    ] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [reverseLookupTwinId, setReverseLookupTwinId] = useState(
        lookupTwinId
    );
    const [ADXConnectionInfo, setADXConnectionInfo] = useState<IADXConnection>(
        null
    );
    const { t } = useTranslation();
    const lookupTwinIdRef = useRef(lookupTwinId);

    const connectionState = useAdapter({
        adapterMethod: () => adapter.getConnectionInformation(),
        refetchDependencies: [adapter]
    });

    const hasConnectionInfo = useMemo(
        () =>
            Boolean(
                ADXConnectionInfo?.kustoClusterUrl &&
                    ADXConnectionInfo?.kustoDatabaseName &&
                    ADXConnectionInfo?.kustoTableName
            ),
        [ADXConnectionInfo]
    );

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

    useEffect(() => {
        if (!connectionState.adapterResult.hasNoData()) {
            setADXConnectionInfo(connectionState.adapterResult.getData());
        }
    }, [connectionState.adapterResult.result]);

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
                    {selectedTwin && ADXConnectionInfo && (
                        <Board
                            theme={theme}
                            locale={locale}
                            adtTwin={selectedTwin}
                            adapter={adapter}
                            errorMessage={errorMessage}
                            onEntitySelect={onEntitySelect}
                            searchSpan={searchSpanForDataHistory}
                            hasDataHistory={hasConnectionInfo}
                        />
                    )}
                </div>
            </BaseCompositeCard>
        </div>
    );
};

export default React.memo(ADTTwinsPage);
