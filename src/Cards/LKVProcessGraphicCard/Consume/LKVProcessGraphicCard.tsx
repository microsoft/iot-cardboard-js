import React, { memo } from 'react';
import { LKVProcessGraphicCardProps } from './LKVProcessGraphicCard.types';
import './LKVProcessGraphicCard.scss';
import BaseCard from '../../Base/Consume/BaseCard';
import useAdapter from '../../../Models/Hooks/useAdapter';
import { withErrorBoundary } from '../../../Models/Context/ErrorBoundary';

const LKVProcessGraphicCard: React.FC<LKVProcessGraphicCardProps> = ({
    id,
    properties,
    adapter,
    pollingIntervalMillis,
    adapterAdditionalParameters,
    imageSrc,
    imagePropertyPositions,
    title,
    theme,
    locale,
    localeStrings
}) => {
    const cardState = useAdapter({
        adapterMethod: () => adapter.getKeyValuePairs(id, properties),
        refetchDependencies: [id, properties],
        isLongPolling: true,
        pollingIntervalMillis: pollingIntervalMillis
    });

    return (
        <BaseCard
            title={title}
            isLoading={
                cardState.isLoading && cardState.adapterResult.hasNoData()
            }
            adapterResult={cardState.adapterResult}
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
            adapterAdditionalParameters={adapterAdditionalParameters}
        >
            <div className={'cb-lkvpg-wrapper'}>
                <img className={'cb-img-wrapper'} src={imageSrc} />
                <div className={'cb-lkv-wrapper'}>
                    {cardState.adapterResult?.result?.data &&
                        cardState.adapterResult?.result?.data &&
                        cardState.adapterResult.result.data.map((kvp, i) => (
                            <LKVValue
                                style={imagePropertyPositions[kvp.key]}
                                key={i}
                                pulse={cardState.pulse}
                                title={kvp.key}
                                value={kvp.value}
                            />
                        ))}
                </div>
            </div>
        </BaseCard>
    );
};

const LKVValue: React.FC<any> = ({ title, value, pulse, style }) => {
    return (
        <div
            style={style}
            className={`cb-lkv-value ${pulse ? 'cb-lkv-value-pulse' : ''}`}
        >
            <div className={'cb-lkv-value-title'}>{title}</div>
            {typeof value === 'object' ? (
                <div className={'cb-lkv-subvalues'}>
                    {Object.keys(value).map((k, i) => (
                        <div key={i} className={'cb-lkv-subvalue'}>
                            <div className={'cb-lkv-subvalue-title'}>{k}</div>
                            <div className={'cb-lkv-subvalue-value'}>
                                {value[k]}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={'cb-lkv-value-value'}>{value}</div>
            )}
        </div>
    );
};

export default withErrorBoundary(memo(LKVProcessGraphicCard));
