import React, { useEffect, useRef, useState } from 'react';
import ClientLinechart from 'tsiclient/LineChart';
import './LinechartCard.scss';
import 'tsiclient/tsiclient.css';
import { LinechartCardProps } from './LinechartCard.types';
import BaseCard from '../../Base/Consume/BaseCard';
import { useTranslation } from 'react-i18next';
import useGuid from '../../../Models/Hooks/useGuid';
import { Theme } from '../../../Models/Constants/Enums';
import useCardState from '../../../Models/Hooks/useCardState';

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
    const chart = useRef(null);
    const cardState = useCardState();

    const renderChart = async () => {
        if (chart !== null) {
            cardState.setIsLoading(true);
            const lcd = await adapter.getTsiclientChartDataShape(
                id,
                searchSpan,
                properties,
                additionalProperties
            );
            cardState.setIsLoading(false);
            cardState.setAdapterResult(lcd);

            const noData = lcd && lcd.data === null;
            if (!noData) {
                chart.current.render(lcd.data, {
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
        if (chart.current === null) {
            chart.current = new ClientLinechart(
                document.getElementById(chartContainerGUID)
            );
        }
        renderChart();
    }, [properties, additionalProperties, searchSpan]);

    return (
        <BaseCard
            isLoading={cardState.isLoading}
            adapterResult={cardState.adapterResult}
            theme={theme}
            title={title}
        >
            <div
                className="cb-linechart-container"
                id={chartContainerGUID}
            ></div>
        </BaseCard>
    );
};

export default React.memo(LinechartCard);
