import React, { memo } from 'react';
import BaseCard from '../BaseCard/BaseCard';
import useAdapter from '../../Models/Hooks/useAdapter';
import { GeoSpatialCardProps } from './GeoSpatialCard.types';
import './GeoSpatialCard.scss';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';

const GeoSpatialCard: React.FC<GeoSpatialCardProps> = ({
    adapter,
    pollingIntervalMillis,
    properties,
    id,
    title,
    theme,
    locale,
    localeStrings,
    adapterAdditionalParameters
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
            <div className={'cb-geospatial-wrapper'}>
                {cardState.adapterResult?.result?.data &&
                    cardState.adapterResult.result.data.map((kvp, idx) => (
                        <GeoSpatialValue
                            key={idx}
                            pulse={cardState.pulse}
                            title={kvp.key}
                            value={kvp.value}
                        />
                    ))}
            </div>
        </BaseCard>
    );
};

const GeoSpatialValue: React.FC<any> = ({ title, value, pulse, style }) => {
    return (
        <div
            style={style}
            className={`cb-gs-value ${pulse ? 'cb-gs-value-pulse' : ''}`}
        >
            <div className={'cb-gs-value-title'}>{title}</div>
            {typeof value === 'object' ? (
                <div className={'cb-gs-subvalues'}>
                    {Object.keys(value).map((k, i) => (
                        <div key={i} className={'cb-gs-subvalue'}>
                            <div className={'cb-gs-subvalue-title'}>{k}</div>
                            <div className={'cb-gs-subvalue-value'}>
                                {value[k]}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={'cb-gs-value-value'}>{value}</div>
            )}
        </div>
    );
};

export default withErrorBoundary(memo(GeoSpatialCard));
