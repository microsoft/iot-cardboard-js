import React, { useCallback, useEffect, useState } from 'react';
import { LKVProcessGraphicCardProps } from './LKVProcessGraphicCard.types';
import './LKVProcessGraphicCard.scss';
import BaseCard from '../../Base/Consume/BaseCard';

const LKVProcessGraphicCard: React.FC<LKVProcessGraphicCardProps> = ({
    id,
    properties,
    adapter,
    pollingIntervalMillis,
    additionalProperties,
    imageSrc,
    title,
    theme
}) => {
    const [graphicProperties, setGraphicProperties] = useState({});
    const [pulse, setPulse] = useState(false);
    let pulseTimeout;
    let isMounted;
    const getChartData = useCallback(async () => {
        const kvps = await adapter.getKeyValuePairs(id, properties);
        if (isMounted) {
            setPulse(true);
            setGraphicProperties(kvps);
            pulseTimeout = setTimeout(() => setPulse(false), 500);
        }
    }, []);
    useEffect(() => {
        isMounted = true;
        getChartData();
        const dataLongPoll = setInterval(getChartData, pollingIntervalMillis);
        return function cleanup() {
            isMounted = false;
            clearInterval(dataLongPoll);
            clearTimeout(pulseTimeout);
        };
    }, []);
    return (
        <BaseCard title={title} isLoading={false} noData={false} theme={theme}>
            <div className={'cb-lkvpg-wrapper'}>
                <img className={'cb-img-wrapper'} src={imageSrc} />
                <div className={'cb-lkv-wrapper'}>
                    {Object.keys(graphicProperties).map((prop, i) => (
                        <LKVValue
                            style={additionalProperties[prop]}
                            key={i}
                            pulse={pulse}
                            title={prop}
                            value={graphicProperties[prop]}
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

export default LKVProcessGraphicCard;
