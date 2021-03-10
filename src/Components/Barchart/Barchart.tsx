import React, { useEffect, useRef } from 'react';
import ClientBarchart from 'tsiclient/GroupedBarChart';
import 'tsiclient/tsiclient.css';
import { BarchartProps } from './Barchart.types';
import useGuid from '../../Models/Hooks/useGuid';

const Barchart: React.FC<BarchartProps> = ({
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
        };

        if (chart.current === null) {
            chart.current = new ClientBarchart(
                document.getElementById(chartContainerGUID)
            );
        }
        if (dataIsValid()) {
            //TODO need fix in tsiclient for no timestamp when no data passed in. tries to get timestamp from allTimestampArray, which is empty
            chart.current.render(data, chartOptions);
        }
    }, [data, chartOptions, chartDataOptions]);

    return (
        <div className="cb-linechart-container" id={chartContainerGUID}></div>
    );
};

export default React.memo(Barchart);
