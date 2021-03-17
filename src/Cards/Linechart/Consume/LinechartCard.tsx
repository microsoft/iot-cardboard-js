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
    title,
    locale
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
        return cardState?.adapterResult.getData();
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

    const getChartDataOptions = (data) => {
        if (additionalProperties?.chartDataOptions) {
            return additionalProperties.chartDataOptions;
        }
        return data?.map(() => {
            return {};
        });
    };

    return (
        <BaseCard
            isLoading={cardState.isLoading}
            adapterResult={cardState.adapterResult}
            theme={theme}
            title={title}
            locale={locale}
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
