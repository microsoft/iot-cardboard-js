import { Icon } from '@fluentui/react';
import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ViewerConfigUtility from '../../../Models/Classes/ViewerConfigUtility';
import {
    getSceneElementStatusColor,
    parseExpression,
    performSubstitutions
} from '../../../Models/Services/Utils';
import {
    IAlertVisual,
    IBehavior,
    IStatusColoringVisual,
    ITwinToObjectMapping,
    IVisual
} from '../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { CardboardList } from '../../CardboardList/CardboardList';
import { ICardboardListItem } from '../../CardboardList/CardboardList.types';
import {
    getElementsPanelAlertStyles,
    getElementsPanelStyles,
    getElementsPanelStatusStyles,
    getElementsPanelButtonSyles
} from '../ViewerElementsPanel.styles';
import {
    ViewerElementsPanelItem,
    ViewerElementsPanelListProps
} from '../ViewerElementsPanel.types';

const ElementsList: React.FC<ViewerElementsPanelListProps> = ({
    panelItems,
    filterTerm,
    onItemClick,
    onItemHover
}) => {
    const { t } = useTranslation();
    const elementsPanelStyles = getElementsPanelStyles();

    const listItems = useMemo(
        () => getListItems(panelItems, onItemClick, onItemHover),
        [panelItems]
    );

    return (
        <div className={elementsPanelStyles.list}>
            {panelItems.length === 0 ? (
                <p style={{ padding: '0px 20px' }}>
                    {t('elementsPanel.noElements')}
                </p>
            ) : (
                <CardboardList<ITwinToObjectMapping | IVisual>
                    items={listItems}
                    listKey={`elements-panel`}
                    textToHighlight={filterTerm}
                />
            )}
        </div>
    );
};

const sortPanelItemsForDisplay = (
    panelItems: Array<ViewerElementsPanelItem>
) => {
    const sortedPanelItems: Array<ViewerElementsPanelItem> = [];
    const panelItemsWithAlerts: Array<ViewerElementsPanelItem> = [];
    const panelItemsWithStatusAndWithoutAlerts: Array<ViewerElementsPanelItem> = [];
    const panelItemsWithoutAlertsAndWithoutStatus: Array<ViewerElementsPanelItem> = [];

    // traverse all the panel items and group them based on if they have alerts, status or nothing
    panelItems.forEach((panelItem) => {
        const flattenedPanelItemVisuals = [].concat(
            ...panelItem.behaviors.map((behavior) => behavior.visuals)
        );
        if (flattenedPanelItemVisuals.some(ViewerConfigUtility.isAlertVisual)) {
            panelItemsWithAlerts.push(panelItem);
        } else if (
            flattenedPanelItemVisuals.some(
                ViewerConfigUtility.isStatusColorVisual
            )
        ) {
            panelItemsWithStatusAndWithoutAlerts.push(panelItem);
        } else {
            panelItemsWithoutAlertsAndWithoutStatus.push(panelItem);
        }
    });

    // sort the grouped items by first number of alerts and then element name
    panelItemsWithAlerts.sort((a, b) => {
        const aPanelItemVisuals = [].concat(
            ...a.behaviors.map((behavior) => behavior.visuals)
        );
        const bPanelItemVisuals = [].concat(
            ...b.behaviors.map((behavior) => behavior.visuals)
        );
        if (aPanelItemVisuals.length === bPanelItemVisuals.length) {
            return a.element.displayName.localeCompare(
                b.element.displayName,
                undefined,
                {
                    sensitivity: 'base'
                }
            );
        }
        return aPanelItemVisuals.length > bPanelItemVisuals.length ? 1 : -1;
    });
    panelItemsWithStatusAndWithoutAlerts.sort((a, b) =>
        a.element.displayName.localeCompare(b.element.displayName, undefined, {
            sensitivity: 'base'
        })
    );
    panelItemsWithoutAlertsAndWithoutStatus.sort((a, b) =>
        a.element.displayName.localeCompare(b.element.displayName, undefined, {
            sensitivity: 'base'
        })
    );
    return sortedPanelItems.concat(
        panelItemsWithAlerts,
        panelItemsWithStatusAndWithoutAlerts,
        panelItemsWithoutAlertsAndWithoutStatus
    );
};

function getListItems(
    panelItems: Array<ViewerElementsPanelItem>,
    onItemClick: (
        item: ITwinToObjectMapping | IVisual,
        panelItem: ViewerElementsPanelItem,
        behavior?: IBehavior
    ) => void,
    onItemHover?: (
        item: ITwinToObjectMapping | IVisual,
        panelItem: ViewerElementsPanelItem,
        behavior?: IBehavior
    ) => void
): Array<ICardboardListItem<ITwinToObjectMapping | IVisual>> {
    const sortedPanelItems = sortPanelItemsForDisplay(panelItems);
    const buttonStyles = getElementsPanelButtonSyles();
    const listItems: Array<
        ICardboardListItem<ITwinToObjectMapping | IVisual>
    > = [];

    sortedPanelItems.map((panelItem) => {
        const element = panelItem.element;
        let statuses: Array<{
            behavior: IBehavior;
            statusVisual: IStatusColoringVisual;
        }> = [];
        let alerts: Array<{
            behavior: IBehavior;
            alertVisual: IAlertVisual;
            alertVisualDisplayTitle: string;
        }> = [];

        panelItem.behaviors.map((b) => {
            statuses = statuses.concat(
                b.visuals.filter(ViewerConfigUtility.isStatusColorVisual).map(
                    (statusVisual) =>
                        ({
                            behavior: b,
                            statusVisual: statusVisual
                        } as any)
                )
            );
            alerts = alerts.concat(
                b.visuals.filter(ViewerConfigUtility.isAlertVisual).map(
                    (alertVisual) =>
                        ({
                            behavior: b,
                            alertVisual: alertVisual,
                            alertVisualDisplayTitle: performSubstitutions(
                                alertVisual.labelExpression,
                                panelItem.twins
                            )
                        } as any)
                )
            );
        });

        //sort the alert within its own group by name
        alerts.sort((a, b) =>
            a.alertVisualDisplayTitle.localeCompare(
                b.alertVisualDisplayTitle,
                undefined,
                {
                    sensitivity: 'base'
                }
            )
        );

        const elementItemWithStatus: ICardboardListItem<ITwinToObjectMapping> = {
            ariaLabel: element.displayName,
            buttonProps: {
                customStyles: buttonStyles,
                ...(onItemHover && {
                    onMouseOver: () => onItemHover(element, panelItem)
                }),
                ...(onItemHover && {
                    onBlur: () => onItemHover(element, panelItem)
                })
            },
            iconStartName: (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        overflow: 'hidden'
                    }}
                >
                    {statuses.map((status) => (
                        <div
                            className={
                                getElementsPanelStatusStyles(
                                    getSceneElementStatusColor(
                                        status.statusVisual
                                            .statusValueExpression,
                                        status.statusVisual.valueRanges,
                                        panelItem.twins
                                    )
                                ).statusLine
                            }
                        ></div>
                    ))}
                </div>
            ),
            item: element,
            onClick: () => onItemClick(element, panelItem),
            textPrimary: element.displayName
        };
        listItems.push(elementItemWithStatus);

        alerts.map((alert) => {
            const alertStyles = getElementsPanelAlertStyles(
                alert.alertVisual.color
            );
            if (
                parseExpression(
                    alert.alertVisual.triggerExpression,
                    panelItem.twins
                )
            ) {
                const alertItem: ICardboardListItem<IAlertVisual> = {
                    ariaLabel: alert.alertVisualDisplayTitle,
                    buttonProps: {
                        customStyles: buttonStyles,
                        ...(onItemHover && {
                            onMouseOver: () => onItemHover(element, panelItem)
                        }),
                        ...(onItemHover && {
                            onBlur: () => onItemHover(element, panelItem)
                        })
                    },
                    iconStartName: (
                        <span className={alertStyles.alertCircle}>
                            <Icon iconName={alert.alertVisual.iconName} />
                        </span>
                    ),
                    item: alert.alertVisual,
                    onClick: () =>
                        onItemClick(
                            alert.alertVisual,
                            panelItem,
                            alert.behavior
                        ),
                    textPrimary: alert.alertVisualDisplayTitle
                };
                listItems.push(alertItem);
            }
        });
    });

    return listItems;
}

export default memo(ElementsList);
