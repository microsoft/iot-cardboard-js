import { Icon } from '@fluentui/react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import ViewerConfigUtility from '../../../../Models/Classes/ViewerConfigUtility';
import {
    getSceneElementStatusColor,
    parseExpression,
    performSubstitutions
} from '../../../../Models/Services/Utils';
import {
    IAlertVisual,
    IBehavior,
    IStatusColoringVisual
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
    const { twins, isPreview } = useContext(BehaviorsModalContext);

    const alertVisuals = useMemo(() => {
        let visibleAlertVisuals =
            behavior.visuals.filter(ViewerConfigUtility.isAlertVisual) || [];

        if (!isPreview) {
            visibleAlertVisuals = visibleAlertVisuals.filter((av) =>
                parseExpression(av.triggerExpression, twins)
            );
        }
        return visibleAlertVisuals;
    }, [behavior]);

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
                <AlertBlock alertVisual={av} key={idx} />
            ))}
            {statusVisuals.map((sv, idx) => (
                <StatusBlock statusVisual={sv} key={idx} />
            ))}
            {popoverVisual && (
                <WidgetsContainer popoverVisual={popoverVisual} />
            )}
        </div>
    );
};

const AlertBlock: React.FC<{ alertVisual: IAlertVisual }> = ({
    alertVisual
}) => {
    const styles = getStyles();
    const alertStyles = getElementsPanelAlertStyles(alertVisual.color, true);
    const { twins, isPreview } = useContext(BehaviorsModalContext);

    return (
        <div className={styles.infoContainer}>
            <div className={alertStyles.alertCircle}>
                <Icon iconName={alertVisual.iconName} />
            </div>
            <div className={styles.infoTextContainer}>
                {isPreview
                    ? alertVisual.labelExpression
                    : performSubstitutions(alertVisual.labelExpression, twins)}
            </div>
        </div>
    );
};

const StatusBlock: React.FC<{ statusVisual: IStatusColoringVisual }> = ({
    statusVisual
}) => {
    const styles = getStyles();
    const { twins, isPreview } = useContext(BehaviorsModalContext);
    const { statusValueExpression, valueRanges } = statusVisual;
    const isStatusLineVisible = valueRanges.length > 0;

    let statusValue = 0;
    let statusColor;
    let statusStyles;

    if (isPreview) {
        if (!isStatusLineVisible) {
            statusStyles = getStatusBlockStyles(null);
        } else {
            const minValueRange = valueRanges
                .slice(0)
                .sort((a, b) => Number(a.min) - Number(b.min))[0];

            statusValue = Number(minValueRange.min);
            statusColor = minValueRange.color;
            statusStyles = getStatusBlockStyles(statusColor);
        }
    } else {
        statusValue = parseExpression(statusValueExpression, twins);
        statusColor = getSceneElementStatusColor(
            statusValueExpression,
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
                {statusValueExpression}{' '}
                {typeof statusValue === 'number' && `: ${statusValue}`}
            </div>
        </div>
    );
};

export default React.memo(BehaviorSection);
