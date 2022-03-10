import React from 'react';
import './GaugeWidget.scss';
import {
    RadialBarChart,
    RadialBar,
    ResponsiveContainer,
    PolarAngleAxis
} from 'recharts';
import { DTwin } from '../../../Models/Constants/Interfaces';
import { parseExpression } from '../../../Models/Services/Utils';
import { IGaugeWidget } from '../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
interface IProp {
    widget: IGaugeWidget;
    twins: Record<string, DTwin>;
}

export const GaugeWidget: React.FC<IProp> = ({ widget, twins }) => {
    const expression = widget.valueExpression;
    const label = widget.widgetConfiguration.label;
    const width = 150;
    const height = 150;
    const units = widget.widgetConfiguration.units || '';
    let value = 0;
    try {
        value = parseExpression(expression, twins);
        if (!value) {
            value = 0;
        }
        value = Math.floor(value);
    } catch {
        value = 0;
    }

    value = value || 20; // TODO: Hack

    const color = '#00ff00';
    let lastBp: number = undefined;

    lastBp = Number(widget.widgetConfiguration.max) || 1000; // Used as max data point

    const data = [{ value, fill: color }];
    return (
        <div style={{ width: width, height: height, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                    startAngle={180}
                    innerRadius="90%"
                    outerRadius="100%"
                    endAngle={0}
                    barSize={10}
                    data={data}
                >
                    <PolarAngleAxis
                        type="number"
                        domain={[0, lastBp]}
                        dataKey={'value'}
                        angleAxisId={0}
                        tick={false}
                    />
                    <RadialBar
                        color="fill"
                        background={{ fill: '#d3d6db' }}
                        dataKey="value"
                    ></RadialBar>
                </RadialBarChart>
            </ResponsiveContainer>
            <div className="cb-gauge-widget-text">
                <div>
                    {value} {units}
                </div>
                <div>{label}</div>
            </div>
        </div>
    );
};
