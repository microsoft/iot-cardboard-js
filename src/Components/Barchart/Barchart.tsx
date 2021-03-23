import React from 'react';
import ClientBarchart from 'tsiclient/GroupedBarChart';
import 'tsiclient/tsiclient.css';
import { ITSIChartComponentProps } from '../../Models/Constants';
import useTSIChartComponentRender from '../../Models/Hooks/renderTSIChartComponent';

const Barchart: React.FC<ITSIChartComponentProps> = ({
    chartOptions,
    chartDataOptions,
    data
}) => {
    const chartContainerGUID = useTSIChartComponentRender(ClientBarchart, {
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

export default React.memo(Barchart);
