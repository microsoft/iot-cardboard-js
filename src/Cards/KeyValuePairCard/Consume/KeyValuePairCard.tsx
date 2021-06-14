import React, { useEffect } from 'react';
import './KeyValuePairCard.scss';
import BaseCard from '../../Base/Consume/BaseCard';
import useAdapter from '../../../Models/Hooks/useAdapter';
import { KeyValuePairCardProps } from './KeyValuePairCard.types';
import { KeyValuePairData } from '../../../Models/Constants/Types';

const KeyValuePairCard: React.FC<KeyValuePairCardProps> = ({
    id,
    properties,
    adapter,
    adapterAdditionalParameters,
    pollingIntervalMillis,
    theme,
    locale,
    localeStrings
}) => {
    const cardState = useAdapter({
        adapterMethod: () =>
            adapter.getKeyValuePairs(id, properties, {
                ...adapterAdditionalParameters,
                isTimestampIncluded: true
            }),
        refetchDependencies: [id, properties],
        isLongPolling: !!pollingIntervalMillis,
        pollingIntervalMillis: pollingIntervalMillis || null
    });

    useEffect(() => {
        return () => {
            cardState.cancelAdapter();
        };
    }, []);

    return (
        <BaseCard
            isLoading={
                cardState.isLoading && cardState.adapterResult.hasNoData()
            }
            adapterResult={cardState.adapterResult}
            title={properties[0]}
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
        >
            <div className={'cb-kvpc-wrapper'}>
                {cardState.adapterResult?.result?.data &&
                    cardState.adapterResult.result.data.map((kvp, idx) => (
                        <KVP kvp={kvp} key={idx} pulse={cardState.pulse} />
                    ))}
            </div>
        </BaseCard>
    );
};

const KVP: React.FC<any> = ({
    kvp,
    pulse
}: {
    kvp: KeyValuePairData;
    pulse: boolean;
}) => {
    return (
        <div className={`cb-kvpc-kvp ${pulse ? 'cb-kvpc-pulse' : ''}`}>
            <div className={'cb-kvpc-val'}>{kvp.value}</div>
            <div className={'cb-kvpc-ts'}>
                {`${kvp.timestamp?.toLocaleDateString()} ${kvp.timestamp?.toLocaleTimeString()}`}
            </div>
        </div>
    );
};

export default KeyValuePairCard;
