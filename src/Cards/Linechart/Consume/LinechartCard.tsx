import React, { useEffect, useState } from 'react';
import './LinechartCard.scss';
import 'tsiclient/tsiclient.css';
import { LinechartCardProps } from './LinechartCard.types';
import BaseCard from '../../Base/Consume/BaseCard';
import { useTranslation } from 'react-i18next';
import { Theme } from '../../../Models/Constants/Enums';
import Linechart from '../../../Components/Linechart/Linechart';

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

    // TODO turn into re-usable reducers
    const [isLoading, setIsLoading] = useState(true);
    const [adapterResult, setAdapterResult] = useState(null);

    const executeAdapter = async () => {
        setIsLoading(true);
        const lcd = await adapter.getTsiclientChartDataShape(
            id,
            searchSpan,
            properties,
            additionalProperties
        );
        setIsLoading(false);
        setAdapterResult(lcd);
    };

    useEffect(() => {
        executeAdapter();
    }, [properties, additionalProperties, searchSpan]);

    const getData = () => {
        if (isLoading || !adapterResult || adapterResult.hasNoData()) {
            return [];
        }
        return adapterResult?.result?.data;
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
            isLoading={isLoading}
            adapterResult={adapterResult}
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
