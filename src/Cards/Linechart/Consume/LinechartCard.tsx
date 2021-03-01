import React, { useEffect, useState } from 'react';
import ClientLinechart from 'tsiclient/LineChart';
import './LinechartCard.scss';
import 'tsiclient/tsiclient.css';
import { LinechartCardProps } from './LinechartCard.types';
import BaseCard from '../../Base/Consume/BaseCard';
import { useTranslation } from 'react-i18next';
import useGuid from '../../../Models/Hooks/useGuid';
import { Theme } from '../../../Models/Constants/Enums';

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
    const chartContainerGUID = useGuid();
    const [chart, setChart] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [adapterResult, setAdapterResult] = useState(null);
    const [isMounted, setIsMounted] = useState(false);

    const renderChart = async () => {
        if (chart !== null) {
            setIsLoading(true);
            const lcd = await adapter.getTsiclientChartDataShape(
                id,
                searchSpan,
                properties,
                additionalProperties
            );
            setIsLoading(false);
            setAdapterResult(lcd);

            const noData = lcd && lcd.data === null;
            if (!noData) {
                chart.render(lcd.data, {
                    theme: theme ? theme : Theme.Light,
                    legend: 'compact',
                    strings: t('sdkStrings', {
                        returnObjects: true
                    })
                });
            }
        }
    };

    useEffect(() => {
        setChart(
            new ClientLinechart(document.getElementById(chartContainerGUID))
        );
    }, [isMounted]);

    useEffect(() => {
        if (chart !== null) {
            renderChart();
        }
    }, [adapter, chart]);

    return (
        <BaseCard
            isLoading={isLoading}
            adapterResult={adapterResult}
            theme={theme}
            title={title}
        >
            <div
                className="cb-linechart-container"
                id={chartContainerGUID}
                ref={() => setIsMounted(true)}
            ></div>
        </BaseCard>
    );
};

export default React.memo(LinechartCard);
