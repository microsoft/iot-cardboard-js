import React, { useEffect, useState } from 'react';
import ClientLinechart from 'tsiclient/LineChart';
import './LinechartCard.scss';
import 'tsiclient/tsiclient.css';
import { LinechartCardProps } from './LinechartCard.types';
import BaseCard from '../../Base/Consume/BaseCard';
import { useTranslation } from 'react-i18next';
import { createGUID } from '../../../Models/Services/Utils';

const LinechartCard: React.FC<LinechartCardProps> = ({
    id,
    searchSpan,
    properties,
    adapter,
    theme,
    additionalProperties
}) => {
    const { t } = useTranslation();
    const chartContainerGUID = createGUID();
    const [chart, setChart] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [noData, setNoData] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const renderChart = () => {
        if (chart !== null) {
            setNoData(false);
            setIsLoading(true);
            adapter
                .getTsiclientChartDataShape(
                    id,
                    searchSpan,
                    properties,
                    additionalProperties
                )
                .then((lcd) => {
                    setIsLoading(false);
                    const noData = lcd && lcd.data === null;
                    setNoData(noData);
                    if (!noData) {
                        chart.render(lcd.data, {
                            theme: theme,
                            legend: 'compact',
                            strings: t('sdkStrings', {
                                returnObjects: true
                            })
                        });
                    }
                });
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
        <BaseCard isLoading={isLoading} noData={noData}>
            <div
                className="cb-linechart-container"
                id={chartContainerGUID}
                ref={() => setIsMounted(true)}
            ></div>
        </BaseCard>
    );
};

export default React.memo(LinechartCard);
