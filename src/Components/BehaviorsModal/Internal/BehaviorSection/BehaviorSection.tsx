import { Icon } from '@fluentui/react';
import React, { useContext, useMemo } from 'react';
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
    const { twins } = useContext(BehaviorsModalContext);

    const alertVisuals = useMemo(
        () =>
            behavior.visuals
                .filter(ViewerConfigUtility.isAlertVisual)
                .filter((av) => parseExpression(av.triggerExpression, twins)) ||
            [],
        [behavior]
    );
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
            {alertVisuals.map((av) => (
                <AlertBlock alertVisual={av} />
            ))}
            {statusVisuals.map((sv) => (
                <StatusBlock statusVisual={sv} />
            ))}
            {popoverVisual && (
                <WidgetsContainer popoverVisual={popoverVisual} twins={twins} />
            )}
        </div>
    );
};

const AlertBlock: React.FC<{ alertVisual: IAlertVisual }> = ({
    alertVisual
}) => {
    const styles = getStyles();
    const alertStyles = getElementsPanelAlertStyles(alertVisual.color);
    const { twins } = useContext(BehaviorsModalContext);

    return (
        <div className={styles.infoContainer}>
            <div className={alertStyles.alertCircle}>
                <Icon iconName={alertVisual.iconName} />
            </div>
            <div className={styles.infoTextContainer}>
                {performSubstitutions(alertVisual.labelExpression, twins)}
            </div>
        </div>
    );
};

const StatusBlock: React.FC<{ statusVisual: IStatusColoringVisual }> = ({
    statusVisual
}) => {
    const styles = getStyles();
    const { twins } = useContext(BehaviorsModalContext);
    const { statusValueExpression, valueRanges } = statusVisual;

    const statusValue = parseExpression(statusValueExpression, twins);

    const statusStyles = getStatusBlockStyles(
        getSceneElementStatusColor(statusValueExpression, valueRanges, twins)
    );
    return (
        <div className={styles.infoContainer}>
            <div className={styles.infoIconContainer}>
                <div className={statusStyles.statusColorLine}></div>
            </div>
            <div className={styles.infoTextContainer}>
                {statusValueExpression} {statusValue && `: ${statusValue}`}
            </div>
        </div>
    );
};

export default React.memo(BehaviorSection);
