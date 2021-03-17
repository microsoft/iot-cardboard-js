import React from 'react';
import ClientLinechart from 'tsiclient/LineChart';
import 'tsiclient/tsiclient.css';
import { ITSIComponentProps } from '../../Models/Constants';
import useTSIComponentRender from '../../Models/Hooks/renderTSIComponent';

const Linechart: React.FC<ITSIComponentProps> = ({
    chartOptions,
    chartDataOptions,
    data
}) => {
    const chartContainerGUID = useTSIComponentRender(ClientLinechart, {
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
