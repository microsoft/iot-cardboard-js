import { Icon } from '@fluentui/react';
import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SceneVisual } from '../../../Models/Classes/SceneView.types';
import { DTwin } from '../../../Models/Constants/Interfaces';
import {
    getSceneElementStatusColor,
    parseExpression
} from '../../../Models/Services/Utils';
import {
    IAlertVisual,
    IStatusColoringVisual,
    ITwinToObjectMapping,
    IVisual
} from '../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { CardboardList } from '../../CardboardList/CardboardList';
import { ICardboardListItem } from '../../CardboardList/CardboardList.types';
import { performSubstitutions } from '../../Widgets/Widget.Utils';
import {
    getElementsPanelAlertStyles,
    getElementsPanelStyles,
    getElementsPanelStatusStyles,
    getElementsPanelButtonSyles
} from '../ElementsPanel.styles';

interface ElementListProps {
    panelItems: Array<ElementsPanelItem>;
    filterTerm?: string;
    onItemClick?: (
        item: ITwinToObjectMapping | IVisual,
        panelItem: ElementsPanelItem
    ) => void;
    onItemHover?: (
        item: ITwinToObjectMapping | IVisual,
        panelItem: ElementsPanelItem
    ) => void;
}

// ElementsPanelItem is partial of SceneVisual object
export interface ElementsPanelItem extends Partial<SceneVisual> {
    element: ITwinToObjectMapping;
    visuals: Array<IVisual>;
    twins: Record<string, DTwin>;
    meshIds: Array<string>;
}

const ElementList: React.FC<ElementListProps> = ({
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
                <div style={{ padding: '0px 20px' }}>
                    {t('elementsPanel.noElements')}
                </div>
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
    panelItems: Array<ElementsPanelItem>,
    onItemClick?: (
        item: ITwinToObjectMapping | IVisual,
        panelItem: ElementsPanelItem
    ) => void,
    onItemHover?: (
        item: ITwinToObjectMapping | IVisual,
        panelItem: ElementsPanelItem
    ) => void
): Array<ICardboardListItem<ITwinToObjectMapping | IVisual>> {
    const buttonStyles = getElementsPanelButtonSyles();
    const listItems: Array<
        ICardboardListItem<ITwinToObjectMapping | IVisual>
    > = [];

    panelItems.map((panelItem, idx) => {
        const element = panelItem.element;
        const status = panelItem.visuals.find(
            (v) => v.type === 'StatusColoring'
        ) as IStatusColoringVisual;
        const alerts = panelItem.visuals.filter(
            (v) => v.type === 'Alert'
        ) as Array<IAlertVisual>;

        const statusStyles = getElementsPanelStatusStyles(
            getSceneElementStatusColor(
                status.statusValueExpression,
                status.valueRanges,
                panelItem.twins
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
            iconStartName: <div className={statusStyles.statusLine}></div>,
            item: element,
            ...(onItemClick && {
                onClick: () => onItemClick(element, panelItem)
            }),
            textPrimary: element.displayName,
            hasTopSeparator: idx === 0 ? false : true
        };
        listItems.push(elementItemWithStatus);

        alerts.map((alert) => {
            const alertStyles = getElementsPanelAlertStyles(alert.color);
            if (parseExpression(alert.triggerExpression, panelItem.twins)) {
                const alertItem: ICardboardListItem<IAlertVisual> = {
                    ariaLabel: performSubstitutions(
                        alert.labelExpression,
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
                            <Icon iconName={alert.iconName} />
                        </span>
                    ),
                    item: alert,
                    ...(onItemClick && {
                        onClick: () => onItemClick(alert, panelItem)
                    }),
                    textPrimary: performSubstitutions(
                        alert.labelExpression,
                        panelItem.twins
                    )
                };
                listItems.push(alertItem);
            }
        });
    });

    return listItems;
}

export default memo(ElementList);
