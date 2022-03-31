import {
    FontWeights,
    IStyle,
    memoizeFunction,
    mergeStyleSets
} from '@fluentui/react';
import { textOverflow } from '../../../../../Resources/Styles/BaseStyles';
import { behaviorsModalClassPrefix } from '../../../BehaviorsModal.styles';

const classNames = {
    gaugeInfoContainer: `${behaviorsModalClassPrefix}-gauge-info-container`,
    gaugeInfoLabel: `${behaviorsModalClassPrefix}-gauge-info-container`,
    gaugeInfoValue: `${behaviorsModalClassPrefix}-gauge-info-container`,
    gaugeInfoUnits: `${behaviorsModalClassPrefix}-gauge-info-container`,
    gaugeInfoValueContainer: `${behaviorsModalClassPrefix}-gauge-info-value-container`,
    gaugeLegendContainer: `${behaviorsModalClassPrefix}-gauge-legend-container`,
    gaugeLegendDomainLabelMin: `${behaviorsModalClassPrefix}-gauge-legend-domain-label-min`,
    gaugeLegendDomainLabelMax: `${behaviorsModalClassPrefix}-gauge-legend-domain-label-max`
};

export const getStyles = memoizeFunction((_activeColor: string) =>
    mergeStyleSets({
        gaugeInfoContainer: [
            classNames.gaugeInfoContainer,
            {
                width: '100%',
                height: '100%',
                padding: 8,
                position: 'relative',
                overflow: 'hidden'
            } as IStyle
        ],
        gaugeInfoLabel: [
            classNames.gaugeInfoLabel,
            textOverflow,
            {
                fontSize: '12px',
                minHeight: '16px',
                fontWeight: FontWeights.semibold
            } as IStyle
        ],
        gaugeInfoValue: [
            classNames.gaugeInfoValue,
            textOverflow,
            {
                fontSize: '24px',
                flex: '3 3 3',
                minWidth: '60%',
                position: 'relative'
            } as IStyle
        ],
        gaugeInfoUnits: [
            classNames.gaugeInfoUnits,
            textOverflow,
            {
                fontSize: '10px',
                flex: '1 1 1',
                display: 'inline-block',
                alignSelf: 'flex-end',
                marginLeft: 2
            } as IStyle
        ],
        gaugeInfoValueContainer: [
            classNames.gaugeInfoValueContainer,
            {
                display: 'flex',
                justifyContent: 'flex-start',
                width: '100%',
                height: 32,
                marginBottom: 16
            } as IStyle
        ]
    })
);
