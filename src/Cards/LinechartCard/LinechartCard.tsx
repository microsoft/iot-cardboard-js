import React, { memo } from 'react';
import './LinechartCard.scss';
import 'tsiclient/tsiclient.css';
import { LinechartCardProps } from './LinechartCard.types';
import BaseCard from '../BaseCard/BaseCard';
import { useTranslation } from 'react-i18next';
import { Theme } from '../../Models/Constants/Enums';
import Linechart from '../../Components/Linechart/Linechart';
import useAdapter from '../../Models/Hooks/useAdapter';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';

const LinechartCard: React.FC<LinechartCardProps> = ({
    id,
    searchSpan,
    properties,
    adapter,
    theme,
    adapterAdditionalParameters,
    pollingIntervalMillis,
    chartDataOptions,
    chartOptions,
    title,
    locale,
    localeStrings
}) => {
    const { t } = useTranslation();

    const cardState = useAdapter({
        adapterMethod: () =>
            adapter.getTsiclientChartDataShape(
                id,
                searchSpan,
                properties,
                adapterAdditionalParameters
            ),
        refetchDependencies: [id, properties, searchSpan],
        isLongPolling: !!pollingIntervalMillis,
        pollingIntervalMillis: pollingIntervalMillis || null
    });

    const getData = () => {
        return cardState?.adapterResult.getData();
    };

    const getChartOptions = () => {
        if (chartOptions) {
            return chartOptions;
        }
        return {
            theme: theme ? theme : Theme.Light,
            legend: 'compact',
            strings: t('sdkStrings', {
                returnObjects: true
            })
        };
    };

    return (
        <BaseCard
            isLoading={cardState.isLoading}
            adapterResult={cardState.adapterResult}
            theme={theme}
            title={title}
            locale={locale}
            localeStrings={localeStrings}
        >
            <Linechart
                data={getData()}
                chartOptions={getChartOptions()}
                chartDataOptions={chartDataOptions}
            >
            </Linechart>
        </BaseCard>
    );
};

export default withErrorBoundary(memo(LinechartCard));
