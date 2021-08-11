import React, { memo, useCallback } from 'react';
import './KeyValuePairCard.scss';
import BaseCard from '../../Base/Consume/BaseCard';
import useAdapter from '../../../Models/Hooks/useAdapter';
import { KeyValuePairCardProps } from './KeyValuePairCard.types';
import { KeyValuePairData } from '../../../Models/Constants/Types';
import { useTranslation } from 'react-i18next';
import { withErrorBoundary } from '../../../Models/Context/ErrorBoundary';

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
            title={properties?.[0]}
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
        >
            <div className={'cb-kvpc-wrapper'}>
                {cardState.adapterResult?.result?.data &&
                    cardState.adapterResult.result.data.map((kvp, idx) =>
                        Array.isArray(kvp.value) ? (
                            <KVPComponentTable
                                kvp={kvp}
                                key={`cb-kvp-${kvp.key}-${idx}`}
                                pulse={cardState.pulse}
                            />
                        ) : (
                            <KVP
                                kvp={kvp}
                                key={`cb-kvp-${kvp.key}-${idx}`}
                                pulse={cardState.pulse}
                            />
                        )
                    )}
            </div>
        </BaseCard>
    );
};

const KVPComponentTable: React.FC<any> = React.memo(
    ({ kvp, pulse }: { kvp: KeyValuePairData; pulse: boolean }) => {
        const { t } = useTranslation();

        const contextPropertiesTableHeaders = ['Name', 'Value', 'Timestamp'];

        const getContextPropertiesRowsFromKvp = useCallback(
            (kvp: KeyValuePairData) =>
                kvp.value.map((p: KeyValuePairData) => [
                    p.key,
                    p.value,
                    `${p.timestamp.toLocaleDateString()} ${p.timestamp.toLocaleTimeString()}`
                ]),
            []
        );
        return (
            <div className="cb-kvpc-kvp">
                <table
                    className={`cb-component-table ${
                        pulse ? 'cb-kvpc-pulse' : ''
                    }`}
                >
                    <thead>
                        <tr>
                            <td></td>
                            <th
                                scope="col"
                                className="cb-component-table-header-main"
                            >
                                {t('properties')}
                            </th>
                            <td></td>
                        </tr>
                        <tr>
                            {contextPropertiesTableHeaders.map((h, i) => (
                                <th
                                    key={`header-${i}`}
                                    className="cb-component-table-header cb-component-table-cell"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {getContextPropertiesRowsFromKvp(kvp).map((row, i) => (
                            <tr key={`row-${i}`}>
                                {row.map((cell, j) => (
                                    <td
                                        key={`cell-${i}-${j}`}
                                        title={cell}
                                        className="cb-component-table-cell"
                                    >
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
);

const KVP: React.FC<any> = ({
    kvp,
    pulse
}: {
    kvp: KeyValuePairData;
    pulse: boolean;
}) => {
    return (
        <div className={`cb-kvpc-kvp ${pulse ? 'cb-kvpc-pulse' : ''}`}>
            <div className={'cb-kvpc-val'}>{`${kvp.value}`}</div>
            {kvp.timestamp && (
                <div className={'cb-kvpc-ts'}>
                    {`${kvp.timestamp.toLocaleDateString()} ${kvp.timestamp.toLocaleTimeString()}`}
                </div>
            )}
        </div>
    );
};

export default withErrorBoundary(memo(KeyValuePairCard));
