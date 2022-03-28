import { Icon } from '@fluentui/react';
import React, { memo, useEffect, useMemo, useRef } from 'react';
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
    IViewerElementsPanelItem,
    IViewerElementsPanelListProps
} from '../ViewerElementsPanel.types';
import { sortPanelItemsForDisplay } from '../ViewerElementsPanel.Utils';

const ElementsList: React.FC<IViewerElementsPanelListProps> = ({
    isLoading,
    panelItems,
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
        [panelItems]
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
    onItemClick: (
        item: ITwinToObjectMapping | IVisual,
        panelItem: IViewerElementsPanelItem,
        behavior?: IBehavior
    ) => void,
    onItemHover?: (
        item: ITwinToObjectMapping | IVisual,
        panelItem: IViewerElementsPanelItem,
        behavior?: IBehavior
    ) => void,
    onItemBlur?: (
        item: ITwinToObjectMapping | IVisual,
        panelItem: IViewerElementsPanelItem,
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
                b.visuals
                    .filter(
                        (visual) =>
                            ViewerConfigUtility.isAlertVisual &&
                            parseExpression(
                                visual.triggerExpression,
                                panelItem.twins
                            )
                    )
                    .map(
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
                customStyles: buttonStyles.elementButton,
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
                    {statuses.map((status, index) => (
                        <div
                            key={index}
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
            const alertItem: ICardboardListItem<IAlertVisual> = {
                ariaLabel: alert.alertVisualDisplayTitle,
                buttonProps: {
                    customStyles: buttonStyles.alertButton,
                    ...(onItemHover && {
                        onMouseOver: () => onItemHover(element, panelItem)
                    }),
                    ...(onItemBlur && {
                        onBlur: () => onItemBlur(element, panelItem)
                    })
                },
                iconStartName: (
                    <span className={alertStyles.alertCircle}>
                        <Icon iconName={alert.alertVisual.iconName} />
                    </span>
                ),
                item: alert.alertVisual,
                onClick: () =>
                    onItemClick(alert.alertVisual, panelItem, alert.behavior),
                textPrimary: alert.alertVisualDisplayTitle
            };
            listItems.push(alertItem);
        });
    });

    return listItems;
}

export default memo(ElementsList);
