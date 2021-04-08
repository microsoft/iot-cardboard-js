import { useEffect, useRef } from 'react';
import { ITSIChartComponentProps } from '../Constants';
import useGuid from './useGuid';

const useTSIChartComponentRender = (
    component,
    renderParameters: ITSIChartComponentProps
) => {
    const chartContainerGUID = useGuid(renderParameters.guidSeed);
    const chart = useRef(null);

    useEffect(() => {
        if (chart.current === null) {
            chart.current = new component(
                document.getElementById(chartContainerGUID)
            );
        }
        if (renderParameters.data) {
            chart.current.render(
                renderParameters.data,
                renderParameters.chartOptions,
                renderParameters.chartDataOptions
            );
        }
    }, [renderParameters]);

    return chartContainerGUID;
};

export default useTSIChartComponentRender;
