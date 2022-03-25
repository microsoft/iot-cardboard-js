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
    const buttonStyles = getElementsPanelButtonSyles();
    const listItems: Array<
        ICardboardListItem<ITwinToObjectMapping | IVisual>
    > = [];

    panelItems.map((panelItem) => {
        const element = panelItem.element;
        let statuses: Array<{
            behavior: IBehavior;
            statusVisual: IStatusColoringVisual;
        }> = [];
        let alerts: Array<{
            behavior: IBehavior;
            alertVisual: IAlertVisual;
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
                            alertVisual: alertVisual
                        } as any)
                )
            );
        });

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
                    ariaLabel: performSubstitutions(
                        alert.alertVisual.labelExpression,
                        panelItem.twins
                    ),
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
                    textPrimary: performSubstitutions(
                        alert.alertVisual.labelExpression,
                        panelItem.twins
                    )
                };
                listItems.push(alertItem);
            }
        });
    });

    return listItems;
}

export default memo(ElementsList);
