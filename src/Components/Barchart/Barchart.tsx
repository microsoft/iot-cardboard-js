import React from 'react';
import ClientBarchart from 'tsiclient/GroupedBarChart';
import 'tsiclient/tsiclient.css';
import { ITSIChartComponentProps } from '../../Models/Constants';
import useTSIChartComponentRender from '../../Models/Hooks/useRenderTSIChartComponent';

const Barchart: React.FC<ITSIChartComponentProps> = ({
    chartOptions,
    chartDataOptions,
    data,
    guidSeed
}) => {
    const chartContainerGUID = useTSIChartComponentRender(ClientBarchart, {
        chartOptions: chartOptions,
        chartDataOptions: chartDataOptions,
        data: data,
        guidSeed
    });
    return (
        <div
            className="cb-tsicomponent-container"
            id={chartContainerGUID}
        ></div>
    );
};

export default React.memo(Barchart);
