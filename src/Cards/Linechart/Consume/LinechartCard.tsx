import React, { useEffect, useState } from 'react';
import ClientLinechart from 'tsiclient/LineChart';
import './LinechartCard.scss';
import 'tsiclient/tsiclient.css';
import { LinechartCardProps } from './LinechartCard.types';
import BaseCard from '../../Base/Consume/BaseCard';
import { useTranslation } from 'react-i18next';

const LinechartCard: React.FC<LinechartCardProps> = ({
    id,
    searchSpan,
    properties,
    adapter,
    theme
}) => {
    const { t } = useTranslation();
    const [chart, setChart] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [noData, setNoData] = useState(false);
    const renderChart = () => {
        if (chart !== null) {
            setNoData(false);
            setIsLoading(true);
            adapter.getLineChartData(id, searchSpan, properties).then((lcd) => {
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
        setTimeout(() => {
            setChart(
                new ClientLinechart(
                    document.getElementById('linechartContainer')
                )
            );
        });
    }, []);
    useEffect(() => {
        renderChart();
    }, [adapter, chart]);

    return (
        <div className="linechart-container" id="linechartContainer">
            <BaseCard isLoading={isLoading} noData={noData}></BaseCard>
        </div>
    );
};

export default React.memo(LinechartCard);
