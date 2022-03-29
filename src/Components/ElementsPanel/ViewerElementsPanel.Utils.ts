import { memoizeFunction } from '@fluentui/react';
import ViewerConfigUtility from '../../Models/Classes/ViewerConfigUtility';
import {
    getSceneElementStatusColor,
    parseExpression
} from '../../Models/Services/Utils';
import { ViewerElementsPanelItem } from './ViewerElementsPanel.types';

export const sortPanelItemsForDisplay = memoizeFunction(
    (panelItems: Array<ViewerElementsPanelItem>) => {
        const panelItemsWithAlerts: Array<{
            activeAlertNumber: number;
            panelItem: ViewerElementsPanelItem;
        }> = [];
        const panelItemsWithStatusAndWithoutAlerts: Array<{
            activeStatusNumber: number;
            panelItem: ViewerElementsPanelItem;
        }> = [];
        const panelItemsWithoutAlertsAndWithoutStatus: Array<ViewerElementsPanelItem> = [];

        // traverse all the panel items and group them based on if they have active alerts, status or nothing
        panelItems.forEach((panelItem) => {
            const behaviorVisuals = panelItem.behaviors
                ?.filter((behavior) => behavior.visuals)
                .map((behavior) => behavior.visuals);
            const flattenedPanelItemVisuals = [].concat(...behaviorVisuals);
            const activeAlertVisuals = flattenedPanelItemVisuals.filter(
                (visual) =>
                    ViewerConfigUtility.isAlertVisual(visual) &&
                    parseExpression(visual.triggerExpression, panelItem.twins)
            );

            const activeStatusVisuals = flattenedPanelItemVisuals.filter(
                (visual) =>
                    ViewerConfigUtility.isStatusColorVisual(visual) &&
                    getSceneElementStatusColor(
                        visual.statusValueExpression,
                        visual.valueRanges,
                        panelItem.twins
                    )
            );
            if (activeAlertVisuals.length) {
                panelItemsWithAlerts.push({
                    activeAlertNumber: activeAlertVisuals.length,
                    panelItem
                });
            } else if (activeStatusVisuals.length) {
                panelItemsWithStatusAndWithoutAlerts.push({
                    activeStatusNumber: activeStatusVisuals.length,
                    panelItem
                });
            } else {
                panelItemsWithoutAlertsAndWithoutStatus.push(panelItem);
            }
        });

        // sort the grouped items by first number of alerts and then element name
        panelItemsWithAlerts.sort((a, b) => {
            if (a.activeAlertNumber === b.activeAlertNumber) {
                return a.panelItem.element.displayName.localeCompare(
                    b.panelItem.element.displayName,
                    undefined,
                    {
                        sensitivity: 'base'
                    }
                );
            }
            return a.activeAlertNumber > b.activeAlertNumber ? -1 : 1;
        });
        panelItemsWithStatusAndWithoutAlerts.sort((a, b) => {
            if (a.activeStatusNumber === b.activeStatusNumber) {
                return a.panelItem.element.displayName.localeCompare(
                    b.panelItem.element.displayName,
                    undefined,
                    {
                        sensitivity: 'base'
                    }
                );
            }
            return a.activeStatusNumber > b.activeStatusNumber ? -1 : 1;
        });
        panelItemsWithoutAlertsAndWithoutStatus.sort((a, b) =>
            a.element.displayName.localeCompare(
                b.element.displayName,
                undefined,
                {
                    sensitivity: 'base'
                }
            )
        );
        return [].concat(
            ...panelItemsWithAlerts.map(
                (panelItemWithAlert) => panelItemWithAlert.panelItem
            ),
            ...panelItemsWithStatusAndWithoutAlerts.map(
                (panelItemWithStatusAndWithoutAlerts) =>
                    panelItemWithStatusAndWithoutAlerts.panelItem
            ),
            ...panelItemsWithoutAlertsAndWithoutStatus
        );
    }
);
