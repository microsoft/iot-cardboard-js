import React, { useEffect, useRef } from 'react';
import ClientBarchart from 'tsiclient/GroupedBarChart';
import 'tsiclient/tsiclient.css';
import { ITSIComponentProps } from '../../Models/Constants';
import renderTSIComponent from '../../Models/Hooks/renderTSIComponent';
import useGuid from '../../Models/Hooks/useGuid';

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
        <div className="cb-barchart-container" id={chartContainerGUID}></div>
    );
};

export default React.memo(Barchart);
