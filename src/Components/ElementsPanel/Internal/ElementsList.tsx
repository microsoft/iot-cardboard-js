import { Icon } from '@fluentui/react';
import React, { memo, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ViewerConfigUtility from '../../../Models/Classes/ViewerConfigUtility';
import {
    wrapTextInTemplateString,
    parseLinkedTwinExpression
} from '../../../Models/Services/Utils';
import {
    IBehavior,
    IExpressionRangeVisual,
    ITwinToObjectMapping,
    IVisual
} from '../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { ICardboardGroupedListItem } from '../../CardboardList/CardboardGroupedList.types';
import { CardboardList } from '../../CardboardList/CardboardList';
import { StatusPills } from '../../StatusPills/StatusPills';
import {
    getElementsPanelAlertStyles,
    getElementsPanelStyles,
    getElementsPanelButtonSyles
} from '../ViewerElementsPanel.styles';
import {
    ElementsPanelCallback,
    IViewerElementsPanelItem,
    IViewerElementsPanelListProps
} from '../ViewerElementsPanel.types';
import { sortPanelItemsForDisplay } from '../ViewerElementsPanel.Utils';

const ElementsList: React.FC<IViewerElementsPanelListProps> = ({
    isLoading,
    panelItems = [],
    filterTerm,
    onItemClick,
    onItemHover,
    onItemBlur
}) => {
    const { t } = useTranslation();
    const elementsPanelStyles = getElementsPanelStyles();

    // handle only showing "Loading..." on first fetch
    const isInitialDataLoaded = useRef(false);
    useEffect(() => {
        if (panelItems.length) {
            isInitialDataLoaded.current = true;
        }
    }, [panelItems]);

    const listItems = useMemo(
        () => getListItems(panelItems, onItemClick, onItemHover, onItemBlur),
        [panelItems, onItemClick, onItemHover, onItemBlur]
    );

    return (
        <div className={elementsPanelStyles.list}>
            {isLoading && !isInitialDataLoaded.current ? (
                <p style={{ padding: '0px 20px' }}>{t('loading')}</p>
            ) : panelItems.length === 0 ? (
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

function getListItems(
    panelItems: Array<IViewerElementsPanelItem>,
    onItemClick: ElementsPanelCallback,
    onItemHover?: ElementsPanelCallback,
    onItemBlur?: ElementsPanelCallback
): Array<ICardboardGroupedListItem<ITwinToObjectMapping | IVisual>> {
    const sortedPanelItems = sortPanelItemsForDisplay(panelItems);
    const buttonStyles = getElementsPanelButtonSyles();
    const listItems: Array<
        ICardboardGroupedListItem<ITwinToObjectMapping | IVisual>
    > = [];

    sortedPanelItems.map((panelItem) => {
        const element = panelItem.element;
        let statuses: Array<{
            behavior: IBehavior;
            statusVisual: IExpressionRangeVisual;
        }> = [];
        let alerts: Array<{
            behavior: IBehavior;
            alertVisual: IExpressionRangeVisual;
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
                b.visuals
                    .filter(
                        (visual) =>
                            ViewerConfigUtility.isAlertVisual(visual) &&
                            parseLinkedTwinExpression(
                                visual.valueExpression,
                                panelItem.twins
                            )
                    )
                    .map(
                        (alertVisual: IExpressionRangeVisual) =>
                            ({
                                behavior: b,
                                alertVisual: alertVisual,
                                alertVisualDisplayTitle: parseLinkedTwinExpression(
                                    wrapTextInTemplateString(
                                        alertVisual.valueRanges[0].visual
                                            .labelExpression
                                    ),
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

        const elementItemWithStatus: ICardboardGroupedListItem<ITwinToObjectMapping> = {
            ariaLabel: element.displayName,
            buttonProps: {
                customStyles: buttonStyles.elementButton,
                ...(onItemHover && {
                    onMouseEnter: () => onItemHover(element, panelItem),
                    onFocus: () => onItemHover(element, panelItem)
                }),
                ...(onItemBlur && {
                    onMouseLeave: () => onItemBlur(element, panelItem),
                    onBlur: () => onItemBlur(element, panelItem)
                })
            },
            iconStart: () => (
                <ElementStatus statuses={statuses} panelItem={panelItem} />
            ),
            item: element,
            itemType: 'header',
            onClick: () => onItemClick(element, panelItem),
            textPrimary: element.displayName
        };
        listItems.push(elementItemWithStatus);

        alerts.map((alert) => {
            const alertStyles = getElementsPanelAlertStyles(
                alert.alertVisual.valueRanges[0].visual.color
            );
            const onEnter =
                onItemHover && (() => onItemHover(element, panelItem));
            const onLeave =
                onItemBlur && (() => onItemBlur(element, panelItem));
            const alertItem: ICardboardGroupedListItem<IExpressionRangeVisual> = {
                ariaLabel: alert.alertVisualDisplayTitle,
                buttonProps: {
                    customStyles: buttonStyles.alertButton,
                    onMouseEnter: onEnter,
                    onFocus: onEnter,
                    onMouseLeave: onLeave,
                    onBlur: onLeave
                },
                iconStart: () => (
                    <span className={alertStyles.alertCircle}>
                        <Icon
                            iconName={
                                alert.alertVisual.valueRanges[0].visual.iconName
                            }
                        />
                    </span>
                ),
                item: alert.alertVisual,
                itemType: 'item',
                onClick: () =>
                    onItemClick(alert.alertVisual, panelItem, alert.behavior),
                textPrimary: alert.alertVisualDisplayTitle
            };
            listItems.push(alertItem);
        });
    });

    return listItems;
}

interface IElementStatusProps {
    statuses: {
        behavior: IBehavior;
        statusVisual: IExpressionRangeVisual;
    }[];
    panelItem: IViewerElementsPanelItem;
}
const ElementStatus: React.FC<IElementStatusProps> = (props) => {
    const { statuses, panelItem } = props;
    const statusVisuals = statuses.map((s) => s.statusVisual);
    return (
        <StatusPills
            statusVisuals={statusVisuals}
            twins={panelItem.twins}
            width={'wide'}
        />
    );
};

export default memo(ElementsList);
