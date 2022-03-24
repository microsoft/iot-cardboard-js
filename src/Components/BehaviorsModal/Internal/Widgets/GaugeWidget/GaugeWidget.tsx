import React, { useMemo } from 'react';
import './GaugeWidget.scss';
import {
    RadialBarChart,
    RadialBar,
    ResponsiveContainer,
    PolarAngleAxis
} from 'recharts';
import { DTwin } from '../../../../../Models/Constants/Interfaces';
import { parseExpression } from '../../../../../Models/Services/Utils';
import { IGaugeWidget } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';
import { getStyles } from './GaugeWidget.styles';

interface IProp {
    widget: IGaugeWidget;
    twins: Record<string, DTwin>;
}

export const GaugeWidget: React.FC<IProp> = ({ widget, twins }) => {
    const expression = widget.valueExpression;
    const label = widget.widgetConfiguration.label;
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

    const color =
        ViewerConfigUtility.getColorOrNullFromStatusValueRange(
            widget.widgetConfiguration.valueRanges,
            value
        ) || '#00ff00';

    const maxValue: number = useMemo(() => {
        let maxValue = Number('-Infinity');
        widget.widgetConfiguration.valueRanges?.forEach?.((vr) => {
            const val = Number(vr.max);
            if (val > maxValue) {
                maxValue = val;
            }
        });
        return maxValue;
    }, [widget]);

    const data = [{ value, fill: color }];
    const styles = getStyles();

    return (
        <div className={styles.gaugeInfoContainer}>
            <div className={styles.gaugeInfoLabel}>{label}</div>
            <div className={styles.gaugeInfoValueContainer}>
                <div className={styles.gaugeInfoValue}>{value}</div>
                <div className={styles.gaugeInfoUnits}>{units}</div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                    startAngle={180}
                    innerRadius="70%"
                    outerRadius="100%"
                    endAngle={0}
                    barSize={10}
                    data={data}
                >
                    <PolarAngleAxis
                        type="number"
                        domain={[0, maxValue]}
                        dataKey={'value'}
                        angleAxisId={0}
                        tick={false}
                    />
                    <RadialBar
                        color="fill"
                        background={{ fill: 'var(--cb-color-bg-canvas-inset)' }}
                        dataKey="value"
                    ></RadialBar>
                </RadialBarChart>
            </ResponsiveContainer>
        </div>
    );
};
