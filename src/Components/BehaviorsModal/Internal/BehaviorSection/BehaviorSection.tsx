import { Icon, Stack } from '@fluentui/react';
import React, { useContext, useMemo } from 'react';
import ViewerConfigUtility from '../../../../Models/Classes/ViewerConfigUtility';
import { BehaviorModalMode } from '../../../../Models/Constants';
import {
    wrapTextInTemplateString,
    parseLinkedTwinExpression,
    stripTemplateStringsFromText
} from '../../../../Models/Services/Utils';
import {
    IBehavior,
    IExpressionRangeVisual
} from '../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { getElementsPanelAlertStyles } from '../../../ElementsPanel/ViewerElementsPanel.styles';
import { StatusPills } from '../../../StatusPills/StatusPills';
import { BehaviorsModalContext } from '../../BehaviorsModal';
import WidgetsContainer from '../Widgets/WidgetsContainer';
import { getStyles } from './BehaviorSection.styles';

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
            <Stack
                horizontal={true}
                verticalAlign={'center'}
                disableShrink={true}
                className={styles.behaviorHeader}
            >
                <StatusPills
                    statusVisuals={statusVisuals}
                    width={'compact'}
                    twins={twins}
                />
                {behavior.displayName}
            </Stack>
            {alertVisuals.map((av, idx) => (
                <AlertBlock alertVisual={av} key={`${av.type}-${idx}`} />
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
    if (!alertVisual && !alertVisual.valueRanges[0]) {
        return null;
    }

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

export default React.memo(BehaviorSection);
