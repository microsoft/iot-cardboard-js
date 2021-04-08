import React from 'react';
import './LinechartCard.scss';
import 'tsiclient/tsiclient.css';
import { LinechartCardProps } from './LinechartCard.types';
import BaseCard from '../../Base/Consume/BaseCard';
import { useTranslation } from 'react-i18next';
import { Theme } from '../../../Models/Constants/Enums';
import Linechart from '../../../Components/Linechart/Linechart';
import useAdapter from '../../../Models/Hooks/useAdapter';

const LinechartCard: React.FC<LinechartCardProps> = ({
    id,
    searchSpan,
    properties,
    adapter,
    theme,
    adapterAdditionalParameters,
    chartDataOptions,
    chartOptions,
    title,
    locale,
    localeStrings,
    guidSeed
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
        refetchDependencies: [id, properties, searchSpan]
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
                guidSeed={guidSeed}
            ></Linechart>
        </BaseCard>
    );
};

export default React.memo(LinechartCard);
