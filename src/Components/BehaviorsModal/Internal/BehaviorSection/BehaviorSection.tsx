import { Icon } from '@fluentui/react';
import React, { useContext, useMemo } from 'react';
import ViewerConfigUtility from '../../../../Models/Classes/ViewerConfigUtility';
import { BehaviorModalMode } from '../../../../Models/Constants';
import {
    wrapTextInTemplateString,
    getSceneElementStatusColor,
    parseLinkedTwinExpression,
    stripTemplateStringsFromText
} from '../../../../Models/Services/Utils';
import {
    IBehavior,
    IExpressionRangeVisual
} from '../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { getElementsPanelAlertStyles } from '../../../ElementsPanel/ViewerElementsPanel.styles';
import { BehaviorsModalContext } from '../../BehaviorsModal';
import WidgetsContainer from '../Widgets/WidgetsContainer';
import { getStatusBlockStyles, getStyles } from './BehaviorSection.styles';

export interface IBehaviorsSectionProps {
    behavior: IBehavior;
}

const BehaviorSection: React.FC<IBehaviorsSectionProps> = ({ behavior }) => {
    const styles = getStyles();
    const { twins, mode } = useContext(BehaviorsModalContext);

    const alertVisuals = useMemo(() => {
        let visibleAlertVisuals =
            behavior.visuals.filter(ViewerConfigUtility.isAlertVisual) || [];

        if (mode !== BehaviorModalMode.preview) {
            visibleAlertVisuals = visibleAlertVisuals.filter((av) =>
                parseLinkedTwinExpression(av.valueExpression, twins)
            );
        }
        return visibleAlertVisuals;
    }, [behavior.visuals, mode, twins]);

    const statusVisuals = useMemo(
        () =>
            behavior.visuals.filter(ViewerConfigUtility.isStatusColorVisual) ||
            [],
        [behavior]
    );

    const popoverVisual = useMemo(
        () => behavior.visuals.filter(ViewerConfigUtility.isPopoverVisual)[0],
        [behavior]
    );

    return (
        <div className={styles.behaviorSection}>
            <div className={styles.behaviorHeader}>{behavior.displayName}</div>
            {alertVisuals.map((av, idx) => (
                <AlertBlock alertVisual={av} key={`${av.type}-${idx}`} />
            ))}
            {statusVisuals.map((sv, idx) => (
                <StatusBlock statusVisual={sv} key={`${sv.type}-${idx}`} />
            ))}
            {popoverVisual && (
                <WidgetsContainer popoverVisual={popoverVisual} />
            )}
        </div>
    );
};

const AlertBlock: React.FC<{ alertVisual: IExpressionRangeVisual }> = ({
    alertVisual
}) => {
    const styles = getStyles();

    const {
        visual: { color, iconName, labelExpression }
    } = alertVisual.valueRanges[0];

    const alertStyles = getElementsPanelAlertStyles(color);
    const { twins, mode } = useContext(BehaviorsModalContext);

    return (
        <div className={styles.infoContainer}>
            <div className={alertStyles.alertCircle}>
                <Icon iconName={iconName} />
            </div>
            <div className={styles.infoTextContainer}>
                {mode === BehaviorModalMode.preview
                    ? stripTemplateStringsFromText(labelExpression)
                    : parseLinkedTwinExpression(
                          wrapTextInTemplateString(labelExpression),
                          twins
                      )}
            </div>
        </div>
    );
};

const StatusBlock: React.FC<{ statusVisual: IExpressionRangeVisual }> = ({
    statusVisual
}) => {
    const styles = getStyles();
    const { twins, mode } = useContext(BehaviorsModalContext);
    const { valueExpression, valueRanges } = statusVisual;
    const isStatusLineVisible = valueRanges.length > 0;

    let statusValue = 0;
    let statusColor;
    let statusStyles;

    // In preview mode, select min value range to display
    if (mode === BehaviorModalMode.preview) {
        if (!isStatusLineVisible) {
            statusStyles = getStatusBlockStyles(null);
        } else {
            const minValueRange = valueRanges
                .slice(0)
                .sort((a, b) => Number(a.values[0]) - Number(b.values[0]))[0];

            statusValue = Number(minValueRange.values[0]);
            statusColor = minValueRange.visual.color;
            statusStyles = getStatusBlockStyles(statusColor);
        }
    } else {
        statusValue = parseLinkedTwinExpression(valueExpression, twins);
        statusColor = getSceneElementStatusColor(
            valueExpression,
            valueRanges,
            twins
        );
        statusStyles = getStatusBlockStyles(statusColor);
    }

    return (
        <div className={styles.infoContainer}>
            <div className={styles.infoIconContainer}>
                {isStatusLineVisible && (
                    <div className={statusStyles.statusColorLine}></div>
                )}
            </div>
            <div className={styles.infoTextContainer}>
                {valueExpression}{' '}
                {typeof statusValue === 'number' && `: ${statusValue}`}
            </div>
        </div>
    );
};

export default React.memo(BehaviorSection);
