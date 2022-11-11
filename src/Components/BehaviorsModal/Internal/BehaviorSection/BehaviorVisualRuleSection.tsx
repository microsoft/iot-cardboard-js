import {
    DirectionalHint,
    Icon,
    Stack,
    TooltipDelay,
    TooltipHost
} from '@fluentui/react';
import React, { useContext, useMemo } from 'react';
import ViewerConfigUtility from '../../../../Models/Classes/ViewerConfigUtility';
import { BehaviorModalMode } from '../../../../Models/Constants';
import {
    wrapTextInTemplateString,
    parseLinkedTwinExpression,
    stripTemplateStringsFromText,
    shouldShowVisual,
    hasBadge
} from '../../../../Models/Services/Utils';
import { IBehavior } from '../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { getElementsPanelAlertStyles } from '../../../ElementsPanel/ViewerElementsPanel.styles';
import { ColorPills } from '../../../StatusPills/ColorPills';
import { BehaviorsModalContext } from '../../BehaviorsModal';
import WidgetsContainer from '../Widgets/WidgetsContainer';
import { getStyles } from './BehaviorSection.styles';
import { useId } from '@fluentui/react-hooks';
import ColorPillsTooltip from '../../../ColorPillsTooltip/ColorPillsTooltip';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';

export interface IBehaviorsSectionProps {
    behavior: IBehavior;
}

export interface VisualColorings {
    color: string;
    label?: string;
}

export interface VisualBadges {
    color: string;
    iconName: string;
    labelExpression?: string;
}

const BehaviorVisualRuleSection: React.FC<IBehaviorsSectionProps> = ({
    behavior
}) => {
    const styles = getStyles();
    const { twins, mode } = useContext(BehaviorsModalContext);
    const badgeIdPrefix = useId('cb-visual-rule-badge');
    const tooltipId = useId('cb-behavior-section-header-tooltip');
    const theme = useExtendedTheme();

    const { meshColorings, badges } = useMemo(() => {
        const rules =
            behavior.visuals.filter(ViewerConfigUtility.isVisualRule) || [];
        const visualColorings: VisualColorings[] = [];
        const visualBadges: VisualBadges[] = [];
        rules.forEach((rule) => {
            rule.valueRanges.forEach((condition) => {
                if (
                    shouldShowVisual(
                        rule.valueRangeType,
                        twins,
                        rule.valueExpression,
                        condition.values as any
                    )
                ) {
                    if (hasBadge(condition.visual.iconName)) {
                        visualBadges.push({
                            color: condition.visual.color,
                            iconName: condition.visual.iconName,
                            labelExpression: condition.visual.labelExpression
                        });
                    } else {
                        visualColorings.push({
                            color: condition.visual.color,
                            label: condition.visual.labelExpression
                        });
                    }
                }
            });
        });
        return {
            meshColorings: visualColorings,
            badges: visualBadges
        };
    }, [behavior.visuals, mode, twins]);

    const popoverVisual = useMemo(
        () => behavior.visuals.filter(ViewerConfigUtility.isPopoverVisual)[0],
        [behavior]
    );

    const tooltipContent = (colorings: VisualColorings[]) => {
        return <ColorPillsTooltip visualColorings={colorings} />;
    };

    return (
        <>
            <div className={styles.behaviorSection}>
                <TooltipHost
                    id={tooltipId}
                    tooltipProps={{
                        onRenderContent: () => tooltipContent(meshColorings)
                    }}
                    directionalHint={DirectionalHint.leftCenter}
                    delay={TooltipDelay.zero}
                    calloutProps={{
                        isBeakVisible: false,
                        gapSpace: 24,
                        styles: {
                            root: {
                                background: theme.palette.glassyBackground75
                            },
                            calloutMain: {
                                background: 'unset',
                                paddingRight: 24
                            }
                        }
                    }}
                >
                    <Stack
                        aria-describedby={tooltipId}
                        horizontal={true}
                        verticalAlign={'center'}
                        disableShrink={true}
                        className={styles.behaviorHeader}
                    >
                        <ColorPills
                            visualColorings={meshColorings}
                            width={'compact'}
                        />
                        {behavior.displayName}
                    </Stack>
                </TooltipHost>
                {badges.map((bv, idx) => (
                    <BadgeBlock
                        badgeVisual={bv}
                        key={`${badgeIdPrefix}-${idx}`}
                    />
                ))}
                {popoverVisual && (
                    <WidgetsContainer popoverVisual={popoverVisual} />
                )}
            </div>
        </>
    );
};

const BadgeBlock: React.FC<{ badgeVisual: VisualBadges }> = ({
    badgeVisual
}) => {
    const styles = getStyles();
    const { color, iconName, labelExpression } = badgeVisual;

    const badgeStyles = getElementsPanelAlertStyles(color);
    const { twins, mode } = useContext(BehaviorsModalContext);

    return (
        <div className={styles.infoContainer}>
            <div className={badgeStyles.alertCircle}>
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

export default React.memo(BehaviorVisualRuleSection);
