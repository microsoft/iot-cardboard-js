import React, { useEffect, useState } from 'react';
import ClientLinechart from 'tsiclient/LineChart';
import './Linechart.scss';
import 'tsiclient/tsiclient.css';
import { LinechartCardProps } from './Linechart.types';
import { useTranslation } from 'react-i18next';
import useGuid from '../../Models/Hooks/useGuid';
import { Theme } from '../../Models/Constants/Enums';

const LinechartCard: React.FC<LinechartCardProps> = ({
    chartOptions, 
    chartDataOptions,
    data
}) => {
    const { t } = useTranslation();
    const chartContainerGUID = useGuid();
    const [chart, setChart] = useState(null);
    const [isMounted, setIsMounted] = useState(false);
    const renderChart = () => {
        if (chart !== null) {
            chart.render(data, {
                theme: chartOptions.theme ? chartOptions.theme : Theme.Light,
                legend: 'compact',
                strings: t('sdkStrings', {
                    returnObjects: true
                })
            }, chartDataOptions);
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
    }, [chart]);

    return (
        <div
            className="cb-linechart-container"
            id={chartContainerGUID}
            ref={() => setIsMounted(true)}
        ></div>
    );
};

export default React.memo(LinechartCard);
