import React from 'react';
import ClientLinechart from 'tsiclient/LineChart';
import 'tsiclient/tsiclient.css';
import { ITSIChartComponentProps } from '../../Models/Constants';
import useTSIChartComponentRender from '../../Models/Hooks/renderTSIChartComponent';

const Linechart: React.FC<ITSIChartComponentProps> = ({
    chartOptions,
    chartDataOptions,
    data
}) => {
    const chartContainerGUID = useTSIChartComponentRender(ClientLinechart, {
        chartOptions: chartOptions,
        chartDataOptions: chartDataOptions,
        data: data
    });
    return (
        <div
            className="cb-tsicomponent-container"
            id={chartContainerGUID}
        ></div>
    );
};

export default React.memo(Linechart);
