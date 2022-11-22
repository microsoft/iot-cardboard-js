import { memoizeFunction } from '@fluentui/react';
import ViewerConfigUtility from '../../Models/Classes/ViewerConfigUtility';
import {
    hasBadge,
    shouldShowVisual
} from '../../Models/SharedUtils/VisualRuleUtils';
import {
    IExpressionRangeVisual,
    IVisual
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { IViewerElementsPanelItem } from './ViewerElementsPanel.types';

interface ActiveBadgeItems {
    activeBadgeNumber: number;
    panelItem: IViewerElementsPanelItem;
}

interface ActiveColoringItems {
    activeColoringNumber: number;
    panelItem: IViewerElementsPanelItem;
}

export const sortPanelItemsForDisplay = memoizeFunction(
    (
        panelItems: Array<IViewerElementsPanelItem>
    ): IViewerElementsPanelItem[] => {
        if (!panelItems) return [];
        const panelItemsWithBadges: Array<ActiveBadgeItems> = [];
        const panelItemsWithColoringsAndWithoutBadges: Array<ActiveColoringItems> = [];
        const panelItemsWithoutBadgesAndWithoutColorings: Array<IViewerElementsPanelItem> = [];

        // traverse all the panel items and group them based on if they have active alerts, status or nothing
        panelItems.forEach((panelItem) => {
            const behaviorVisuals = panelItem.behaviors
                ?.filter((behavior) => behavior.visuals)
                .map((behavior) => behavior.visuals);
            const flattenedPanelItemVisuals: IVisual[] = [].concat(
                ...behaviorVisuals
            );
            const visualRules = flattenedPanelItemVisuals.filter((visual) => {
                return ViewerConfigUtility.isVisualRule(visual);
            }) as IExpressionRangeVisual[];
            let activeBadgeVisuals = 0;
            let activeColoringVisuals = 0;
            visualRules.forEach((visualRule) => {
                visualRule.valueRanges.forEach((condition) => {
                    if (
                        shouldShowVisual(
                            visualRule.valueRangeType,
                            panelItem.twins,
                            visualRule.valueExpression,
                            condition.values
                        )
                    ) {
                        if (hasBadge(condition)) {
                            activeBadgeVisuals = activeBadgeVisuals + 1;
                        } else {
                            activeColoringVisuals = activeColoringVisuals + 1;
                        }
                    }
                });
            });

            if (activeBadgeVisuals > 0) {
                panelItemsWithBadges.push({
                    activeBadgeNumber: activeBadgeVisuals,
                    panelItem
                });
            } else if (activeColoringVisuals > 0) {
                panelItemsWithColoringsAndWithoutBadges.push({
                    activeColoringNumber: activeColoringVisuals,
                    panelItem
                });
            } else {
                panelItemsWithoutBadgesAndWithoutColorings.push(panelItem);
            }
        });

        // sort the grouped items by first number of badges, then colorings and then element name
        panelItemsWithBadges.sort((a, b) => {
            if (a.activeBadgeNumber === b.activeBadgeNumber) {
                return a.panelItem.element.displayName.localeCompare(
                    b.panelItem.element.displayName,
                    undefined,
                    {
                        sensitivity: 'base'
                    }
                );
            }
            return a.activeBadgeNumber > b.activeBadgeNumber ? -1 : 1;
        });
        panelItemsWithColoringsAndWithoutBadges.sort((a, b) => {
            if (a.activeColoringNumber === b.activeColoringNumber) {
                return a.panelItem.element.displayName.localeCompare(
                    b.panelItem.element.displayName,
                    undefined,
                    {
                        sensitivity: 'base'
                    }
                );
            }
            return a.activeColoringNumber > b.activeColoringNumber ? -1 : 1;
        });
        panelItemsWithoutBadgesAndWithoutColorings.sort((a, b) =>
            a.element.displayName.localeCompare(
                b.element.displayName,
                undefined,
                {
                    sensitivity: 'base'
                }
            )
        );

        return [].concat(
            ...panelItemsWithBadges.map(
                (panelItemWithBadge) => panelItemWithBadge.panelItem
            ),
            ...panelItemsWithColoringsAndWithoutBadges.map(
                (panelItemWithColoringsAndWithoutBadges) =>
                    panelItemWithColoringsAndWithoutBadges.panelItem
            ),
            ...panelItemsWithoutBadgesAndWithoutColorings
        );
    }
);
