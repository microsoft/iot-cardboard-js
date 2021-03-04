import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LKVProcessGraphicCardProps } from './LKVProcessGraphicCard.types';
import './LKVProcessGraphicCard.scss';
import BaseCard from '../../Base/Consume/BaseCard';
import useCardState from '../../../Models/Hooks/useCardState';
import useLongPoll from '../../../Models/Hooks/useLongPoll';
import useCancellablePromise from '../../../Models/Hooks/useCancellablePromise';
import AdapterResult from '../../../Models/Classes/AdapterResult';
import { IAdapterData } from '../../../Models/Constants/Interfaces';
import KeyValuePairAdapterData from '../../../Models/Classes/AdapterDataClasses/KeyValuePairAdapterData';
import { AdapterReturnType } from '../../../Models/Constants/Types';

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
    const cardState = useCardState();
    const { cancellablePromise, cancel } = useCancellablePromise();

    // const getChartData = getCancellableCallback(asyncFunc, continuation, onCancel, [])

    const getChartData = useCallback(async () => {
        cancel(); // Cancel outstanding promises
        const kvps = await cancellablePromise(
            adapter.getKeyValuePairs(id, properties)
        );
        cardState.setAdapterResult(kvps);
    }, [id, properties]);

    const longPoll = useLongPoll({
        callback: getChartData,
        pollInterval: pollingIntervalMillis
        // onCallbackChanged: () => {
        //     cardState.setAdapterResult(null);
        //     abandonPromiseResult.current = true;
        // }
    });

    return (
        <BaseCard
            title={title}
            isLoading={false}
            adapterResult={cardState.adapterResult}
            theme={theme}
        >
            <div className={'cb-lkvpg-wrapper'}>
                <img className={'cb-img-wrapper'} src={imageSrc} />
                <div className={'cb-lkv-wrapper'}>
                    {cardState.adapterResult?.result?.data &&
                        Object.keys(
                            cardState.adapterResult.result.data
                        ).map((prop, i) => (
                            <LKVValue
                                style={additionalProperties[prop]}
                                key={i}
                                pulse={longPoll.pulse}
                                title={prop}
                                value={
                                    cardState.adapterResult.result.data[prop]
                                }
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
