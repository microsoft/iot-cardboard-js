import { Callout, DirectionalHint, Stack } from '@fluentui/react';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import ViewerConfigUtility from '../../../../Models/Classes/ViewerConfigUtility';
import {
    shouldShowVisual,
    hasBadge
} from '../../../../Models/SharedUtils/VisualRuleUtils';
import ColorPills from '../../../ColorPills/ColorPills';
import { BehaviorsModalContext } from '../../BehaviorsModal';
import WidgetsContainer from '../Widgets/WidgetsContainer';
import { getCalloutStyles, getStyles } from './BehaviorSection.styles';
import { useId } from '@fluentui/react-hooks';
import ColorPillsCalloutContent from '../../../ColorPillsCalloutContent/ColorPillsCalloutContent';
import { IBehaviorsSectionProps } from './BehaviorSection.types';
import BadgeBlock from './BadgeBlock';
import {
    VisualBadges,
    VisualColorings
} from '../../../../Models/Constants/VisualRuleTypes';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { BehaviorModalMode } from '../../../../Models/Constants/Enums';

const BehaviorSection: React.FC<IBehaviorsSectionProps> = ({ behavior }) => {
    const styles = getStyles();
    const { twins, mode } = useContext(BehaviorsModalContext);
    const badgeIdPrefix = useId('cb-visual-rule-badge');
    const stackId = useId('cb-behavior-section-header-tooltip');
    const theme = useExtendedTheme();

    // State
    const [isCalloutOpen, setIsCalloutOpen] = useState(false);

    const onItemHover = useCallback(() => {
        setIsCalloutOpen(true);
    }, []);

    const onItemBlur = useCallback(() => {
        setIsCalloutOpen(false);
    }, []);

    const { meshColorings, badges } = useMemo(() => {
        const rules =
            behavior.visuals.filter(ViewerConfigUtility.isVisualRule) || [];
        const visualColorings: VisualColorings[] = [];
        const visualBadges: VisualBadges[] = [];
        rules.forEach((rule) => {
            rule.valueRanges.forEach((condition) => {
                if (mode === BehaviorModalMode.preview) {
                    // Remove filtering if in preview mode
                    if (hasBadge(condition)) {
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
                } else {
                    if (
                        shouldShowVisual(
                            rule.valueRangeType,
                            twins,
                            rule.valueExpression,
                            condition.values
                        )
                    ) {
                        if (hasBadge(condition)) {
                            visualBadges.push({
                                color: condition.visual.color,
                                iconName: condition.visual.iconName,
                                labelExpression:
                                    condition.visual.labelExpression
                            });
                        } else {
                            visualColorings.push({
                                color: condition.visual.color,
                                label: condition.visual.labelExpression
                            });
                        }
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

    return (
        <>
            <div className={styles.behaviorSection}>
                <Stack
                    id={stackId}
                    horizontal={true}
                    verticalAlign={'center'}
                    disableShrink={true}
                    className={styles.behaviorHeader}
                    onFocus={onItemHover}
                    onMouseEnter={onItemHover}
                    onBlur={onItemBlur}
                    onMouseLeave={onItemBlur}
                    tabIndex={0}
                >
                    <ColorPills
                        visualColorings={meshColorings}
                        width={'compact'}
                    />
                    {behavior.displayName}
                    {isCalloutOpen && (
                        <Callout
                            target={`#${stackId}`}
                            directionalHint={DirectionalHint.rightTopEdge}
                            gapSpace={24}
                            isBeakVisible={false}
                            styles={getCalloutStyles(theme)}
                        >
                            <ColorPillsCalloutContent
                                visualColorings={meshColorings}
                            />
                        </Callout>
                    )}
                </Stack>
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

export default React.memo(BehaviorSection);
