import React, { useEffect, useRef } from 'react';
import ClientLinechart from 'tsiclient/LineChart';
import './Linechart.scss';
import 'tsiclient/tsiclient.css';
import { LinechartCardProps } from './Linechart.types';
import useGuid from '../../Models/Hooks/useGuid';

const LinechartCard: React.FC<LinechartCardProps> = ({
    chartOptions, 
    chartDataOptions,
    data
}) => {
    const chartContainerGUID = useGuid();
    const chart = useRef(null);

    useEffect(() => {
        // TODO make this better
        const dataIsValid = () => {
            if (!data) {
                return false;
            }
            return true;
        }
    
        if (chart.current === null) {
            chart.current = new ClientLinechart(
                document.getElementById(chartContainerGUID)
            );
        }
        if (dataIsValid()) {
            chart.current.render(data, chartOptions, chartDataOptions);
        }
    }, [data, chartOptions, chartDataOptions]);

    return (
        <div
            className="cb-linechart-container"
            id={chartContainerGUID}
        ></div>
    );
};

export default React.memo(LinechartCard);
