import React, { useEffect, useRef } from 'react';
import ClientLinechart from 'tsiclient/LineChart';
import './Linechart.scss';
import 'tsiclient/tsiclient.css';
import { LinechartProps } from './Linechart.types';
import useGuid from '../../Models/Hooks/useGuid';

const Linechart: React.FC<LinechartProps> = ({
    chartOptions,
    chartDataOptions,
    data
}) => {
    const chartContainerGUID = useGuid();
    const chart = useRef(null);

    useEffect(() => {
        if (chart.current === null) {
            chart.current = new ClientLinechart(
                document.getElementById(chartContainerGUID)
            );
        }
        if (data) {
            chart.current.render(data, chartOptions, chartDataOptions);
        }
    }, [data, chartOptions, chartDataOptions]);

    return (
        <div className="cb-linechart-container" id={chartContainerGUID}></div>
    );
};

export default React.memo(Linechart);
