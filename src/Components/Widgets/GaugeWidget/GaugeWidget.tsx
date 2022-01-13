import React from 'react';
import { Parser } from 'expr-eval';
import './GaugeWidget.scss';
import {
    RadialBarChart,
    RadialBar,
    ResponsiveContainer,
    PolarAngleAxis
} from 'recharts';
import { ControlConfiguration } from '../../../Models/Classes/3DVConfig';
import { DTwin } from '../../../Models/Constants/Interfaces';
interface IProp {
    config: ControlConfiguration;
    twins: Record<string, DTwin>;
}

export const GaugeWidget: React.FC<IProp> = ({ config, twins }) => {
    const expression = config.expression;
    const label = config.label;
    const width = config.width || 150;
    const height = config.height || 150;
    const units = config.units || '';
    let value = 0;
    try {
        value = Parser.evaluate(expression, twins);
        if (!value) {
            value = 0;
        }
        value = Math.floor(value);
    } catch {
        value = 0;
    }

    value = value || 20; // TODO: Hack

    let color = '#ff0000';
    let lastBp: number = undefined;
    if (
        config.valueBreakPoints?.length &&
        config.colors?.length === config.valueBreakPoints.length
    ) {
        for (let i = 0; i < config.valueBreakPoints.length; i++) {
            const bp = config.valueBreakPoints[i];
            const c = config.colors[i];
            if (lastBp === undefined) {
                color = c;
                lastBp = bp;
            } else if (value > lastBp) {
                color = c;
            }
            lastBp = bp;
        }
    }

    lastBp = lastBp || 1000; // Used as max data point

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
