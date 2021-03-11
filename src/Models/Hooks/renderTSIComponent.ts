import { useEffect, useRef } from 'react';
import { ITSIComponentProps } from '../Constants';
import useGuid from './useGuid';

const renderTSIComponent = (
    component,
    renderParameters: ITSIComponentProps
) => {
    const chartContainerGUID = useGuid();
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

export default renderTSIComponent;
