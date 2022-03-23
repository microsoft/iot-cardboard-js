import { getTheme, Icon } from '@fluentui/react';
import React, { useContext, useMemo } from 'react';
import ViewerConfigUtility from '../../../../Models/Classes/ViewerConfigUtility';
import {
    getSceneElementStatusColor,
    parseExpression
} from '../../../../Models/Services/Utils';
import {
    IAlertVisual,
    IBehavior,
    IStatusColoringVisual
} from '../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { performSubstitutions } from '../../../Widgets/Widget.Utils';
import { BehaviorsModalContext } from '../../BehaviorsModal';
import { getStatusBlockStyles, getStyles } from './BehaviorSection.styles';

export interface IBehaviorsSectionProps {
    behavior: IBehavior;
}

const BehaviorSection: React.FC<IBehaviorsSectionProps> = ({ behavior }) => {
    const theme = getTheme();
    const styles = getStyles(theme);

    const alertVisual = useMemo(
        () =>
            behavior.visuals.filter(ViewerConfigUtility.isAlertVisual)[0] ||
            null,
        [behavior]
    );
    const statusVisual = useMemo(
        () =>
            behavior.visuals.filter(
                ViewerConfigUtility.isStatusColorVisual
            )[0] || null,
        [behavior]
    );

    return (
        <div className={styles.behaviorSection}>
            <div className={styles.behaviorHeader}>{behavior.displayName}</div>
            {alertVisual && <AlertBlock alertVisual={alertVisual} />}
            {statusVisual && <StatusBlock statusVisual={statusVisual} />}
            <div></div>
        </div>
    );
};

const AlertBlock: React.FC<{ alertVisual: IAlertVisual }> = ({
    alertVisual
}) => {
    const theme = getTheme();
    const styles = getStyles(theme);
    const { twins } = useContext(BehaviorsModalContext);

    return (
        <div className={styles.infoContainer}>
            <div className={styles.infoIconContainer}>
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
    const theme = getTheme();
    const styles = getStyles(theme);
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
                {statusValueExpression} {statusValue && ` (${statusValue})`}
            </div>
        </div>
    );
};

export default React.memo(BehaviorSection);
