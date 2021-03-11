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
    additionalProperties,
    title
}) => {
    const { t } = useTranslation();

    const cardState = useAdapter({
        adapterMethod: () =>
            adapter.getTsiclientChartDataShape(
                id,
                searchSpan,
                properties,
                additionalProperties
            ),
        refetchDependencies: [id, properties, searchSpan]
    });

    const getData = () => {
        if (cardState?.adapterResult?.result && !cardState?.adapterResult?.hasNoData()) {
            return cardState.adapterResult.result.data;
        }
        return [];
    };

    const getChartOptions = () => {
        return {
            theme: theme ? theme : Theme.Light,
            legend: 'compact',
            strings: t('sdkStrings', {
                returnObjects: true
            })
        };
    };

    // TODO
    const getChartDataOptions = (data) => {
        if (additionalProperties?.chartOptions) {
            return additionalProperties.chartOptions;
        }
        return data.map(() => {return {}});
    };

    return (
        <BaseCard
            isLoading={cardState.isLoading}
            adapterResult={cardState.adapterResult}
            theme={theme}
            title={title}
        >
            <Linechart
                data={getData()}
                chartOptions={getChartOptions()}
                chartDataOptions={getChartDataOptions(getData())}
            ></Linechart>
        </BaseCard>
    );
};

export default React.memo(LinechartCard);
