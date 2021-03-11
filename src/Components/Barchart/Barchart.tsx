import React from 'react';
import ClientBarchart from 'tsiclient/GroupedBarChart';
import 'tsiclient/tsiclient.css';
import { ITSIComponentProps } from '../../Models/Constants';
import renderTSIComponent from '../../Models/Hooks/renderTSIComponent';

const Barchart: React.FC<ITSIComponentProps> = ({
    chartOptions,
    chartDataOptions,
    data
}) => {
    const chartContainerGUID = renderTSIComponent(ClientBarchart, {
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
