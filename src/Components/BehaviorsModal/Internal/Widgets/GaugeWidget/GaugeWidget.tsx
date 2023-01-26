import React, { useContext } from 'react';
import { parseLinkedTwinExpression } from '../../../../../Models/Services/Utils';
import { IGaugeWidget } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';
import { getStyles } from './GaugeWidget.styles';
import GaugeChart from 'react-gauge-chart';
import { BehaviorsModalContext } from '../../../BehaviorsModal';
import { BehaviorModalMode } from '../../../../../Models/Constants';
import { formatNumber } from '../../../../../Models/Services/Utils';

interface IProp {
    widget: IGaugeWidget;
}

const GaugeWidget: React.FC<IProp> = ({ widget }) => {
    const { twins, mode } = useContext(BehaviorsModalContext);
    const expression = widget.valueExpression;
    const label = widget.widgetConfiguration.label;
    const units = widget.widgetConfiguration.units || '';
    let value = 0;
    let formatedValue = '';
    try {
        if (mode === BehaviorModalMode.preview) {
            // In preview mode, gauge uses min value range as value
            value = Number(
                widget.widgetConfiguration.valueRanges
                    .slice(0)
                    .sort(
                        (a, b) => Number(a.values[0]) - Number(b.values[0])
                    )[0].values[0]
            );
        } else {
            value = parseLinkedTwinExpression(expression, twins);
            if (!value) {
                value = 0;
            }
        }
    } catch {
        value = 0;
    }
    formatedValue = formatNumber(value);
    const { valueRanges } = widget.widgetConfiguration;

    // Get active color from value range -- if value not in defined range
    const activeColor = ViewerConfigUtility.getColorOrNullFromStatusValueRange(
        widget.widgetConfiguration.valueRanges,
        value
    );

    const {
        percent,
        colors,
        arcsLength
    } = ViewerConfigUtility.getGaugeWidgetConfiguration(valueRanges, value);

    const styles = getStyles(activeColor);

    return (
        <div className={styles.gaugeInfoContainer}>
            <div className={styles.gaugeInfoLabel}>{label}</div>
            <div className={styles.gaugeInfoValueContainer}>
                <div className={styles.gaugeInfoValue} title={formatedValue}>
                    {formatedValue}
                </div>
                <div className={styles.gaugeInfoUnits} title={String(units)}>
                    {units}
                </div>
            </div>
            <GaugeChart
                id={widget.id}
                colors={colors}
                cornerRadius={1}
                arcsLength={arcsLength}
                percent={percent}
                animate={false}
                needleColor={'var(--cb-color-text-primary)'}
                hideText={true}
                arcPadding={0.02}
            />
        </div>
    );
};

export default React.memo(GaugeWidget);
