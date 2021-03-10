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

    // const renderChart = async () => {
    //     if (chart !== null) {
    //         if (!cardState.adapterResult.hasNoData()) {
    //             chart.current.render(cardState.adapterResult.result.data, {
    //                 theme: theme ? theme : Theme.Light,
    //                 legend: 'compact',
    //                 strings: t('sdkStrings', {
    //                     returnObjects: true
    //                 })
    //             });
    //         }
    //     }
    // };

    // useEffect(() => {
    //     if (chart.current === null) {
    //         chart.current = new ClientLinechart(
    //             document.getElementById(chartContainerGUID)
    //         );
    //     }
    //     renderChart();
    // }, [properties, additionalProperties, searchSpan, cardState.adapterResult]);

    const getData = () => {
        if (cardState?.adapterResult?.result && !cardState?.adapterResult?.hasNoData()) {
            return cardState.adapterResult.result.data;
        }
        return [];
    };

    // TODO probably common for different chart types, refactor
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
    const getChartDataOptions = () => {
        return [];
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
                chartDataOptions={getChartDataOptions()}
            ></Linechart>
        </BaseCard>
    );
};

export default React.memo(LinechartCard);
