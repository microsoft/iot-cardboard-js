import React from 'react';
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
                    cardState.adapterResult.result.data.map((kvp, idx) =>
                        Array.isArray(kvp.value) ? (
                            kvp.value.map((p, idx2) => (
                                <KVP
                                    kvp={p}
                                    key={`${idx}-${idx2}`}
                                    pulse={cardState.pulse}
                                    subtitle={p.key}
                                />
                            ))
                        ) : (
                            <KVP kvp={kvp} key={idx} pulse={cardState.pulse} />
                        )
                    )}
            </div>
        </BaseCard>
    );
};

const KVP: React.FC<any> = ({
    kvp,
    pulse,
    subtitle
}: {
    kvp: KeyValuePairData;
    pulse: boolean;
    subtitle?: string;
}) => {
    return (
        <div className={`cb-kvpc-kvp ${pulse ? 'cb-kvpc-pulse' : ''}`}>
            <div className={'cb-kvpc-title'}>{subtitle}</div>
            <div className={'cb-kvpc-val'}>{`${kvp.value}`}</div>
            {kvp.timestamp && (
                <div className={'cb-kvpc-ts'}>
                    {`${kvp.timestamp.toLocaleDateString()} ${kvp.timestamp.toLocaleTimeString()}`}
                </div>
            )}
        </div>
    );
};

export default KeyValuePairCard;
