import React, { useContext } from 'react';
import { IDataHistoryWidget } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { BehaviorsModalContext } from '../../../BehaviorsModal';

interface IProp {
    widget: IDataHistoryWidget;
}

export const DataHistoryWidget: React.FC<IProp> = ({ widget }) => {
    const { mode } = useContext(BehaviorsModalContext);
    const {
        displayName,
        connectionString,
        timeSeries,
        chartOptions
    } = widget.widgetConfiguration;

    return (
        <div style={{ overflow: 'auto' }}>
            <span>{mode}</span>
            <br />
            {displayName && (
                <>
                    <span>{displayName}</span>
                    <br />
                </>
            )}

            <span>{connectionString}</span>
            <br />
            {timeSeries.length > 0 && (
                <>
                    <span>
                        {timeSeries.map((t) => `${t.expression}, ${t.unit}`)}
                    </span>
                    <br />
                </>
            )}

            <span>{chartOptions.yAxisType}</span>
            <br />
            <span>{chartOptions.defaultQuickTimeSpan}</span>
            <br />
            <span>{chartOptions.aggregationType}</span>
        </div>
    );
};
