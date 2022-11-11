import {
    DirectionalHint,
    Icon,
    TooltipDelay,
    TooltipHost
} from '@fluentui/react';
import React, { memo, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ViewerConfigUtility from '../../../Models/Classes/ViewerConfigUtility';
import {
    wrapTextInTemplateString,
    parseLinkedTwinExpression,
    shouldShowVisual,
    hasBadge
} from '../../../Models/Services/Utils';
import {
    IBehavior,
    IExpressionRangeVisual,
    ITwinToObjectMapping,
    IValueRangeVisual,
    IVisual
} from '../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { VisualColorings } from '../../BehaviorsModal/Internal/BehaviorSection/BehaviorVisualRuleSection';
import { ICardboardGroupedListItem } from '../../CardboardList/CardboardGroupedList.types';
import { CardboardList } from '../../CardboardList/CardboardList';
import ColorPillsTooltip from '../../ColorPillsTooltip/ColorPillsTooltip';
import { ColorPills } from '../../StatusPills/ColorPills';
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
import { useId } from '@fluentui/react-hooks';
import { useExtendedTheme } from '../../../Models/Hooks/useExtendedTheme';

const VisualRuleElementsList: React.FC<IViewerElementsPanelListProps> = ({
    isLoading,
    isModal,
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
        () =>
            getListItems(
                panelItems,
                isModal,
                onItemClick,
                onItemHover,
                onItemBlur
            ),
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
    isModal: boolean,
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
        const elementColorings: Array<VisualColorings> = [];
        const badges: Array<{
            behavior: IBehavior;
            visual: IValueRangeVisual;
            visualRule: IExpressionRangeVisual;
            visualRuleDisplayTitle: string;
        }> = [];
        let visualRules: IExpressionRangeVisual[] = [];

        panelItem.behaviors.map((b) => {
            // Add all visual rules to an array
            visualRules = b.visuals.filter(ViewerConfigUtility.isVisualRule);

            // Separate into their respective arrays
            visualRules.forEach((vr) => {
                vr.valueRanges.forEach((condition) => {
                    // Check if visual will be shown and then determine if it is a badge or element coloring
                    if (
                        shouldShowVisual(
                            vr.valueRangeType,
                            panelItem.twins,
                            vr.valueExpression,
                            condition.values
                        )
                    ) {
                        if (hasBadge(condition.visual.iconName)) {
                            badges.push({
                                behavior: b,
                                visual: condition.visual,
                                visualRuleDisplayTitle: parseLinkedTwinExpression(
                                    wrapTextInTemplateString(
                                        condition.visual.labelExpression
                                    ),
                                    panelItem.twins
                                ),
                                visualRule: vr
                            });
                        } else {
                            elementColorings.push({
                                color: condition.visual.color,
                                label: condition.visual.labelExpression
                            });
                        }
                    }
                });
            });
        });

        //sort the alert within its own group by name
        badges.sort((a, b) =>
            a.visualRuleDisplayTitle.localeCompare(
                b.visualRuleDisplayTitle,
                undefined,
                {
                    sensitivity: 'base'
                }
            )
        );

        const rowId = `cb-element-list-row-${element.id}`;
        const elementItemWithColorings: ICardboardGroupedListItem<ITwinToObjectMapping> = {
            id: rowId,
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
                <ElementColoring
                    rowId={rowId}
                    colorings={elementColorings}
                    isModal={isModal}
                />
            ),
            item: element,
            itemType: 'header',
            onClick: () => onItemClick(element, panelItem),
            textPrimary: element.displayName
        };
        listItems.push(elementItemWithColorings);

        badges.map((badge) => {
            const badgeStyles = getElementsPanelAlertStyles(badge.visual.color);
            const onEnter =
                onItemHover && (() => onItemHover(element, panelItem));
            const onLeave =
                onItemBlur && (() => onItemBlur(element, panelItem));
            const alertItem: ICardboardGroupedListItem<IExpressionRangeVisual> = {
                ariaLabel: badge.visualRuleDisplayTitle,
                buttonProps: {
                    customStyles: buttonStyles.alertButton,
                    onMouseEnter: onEnter,
                    onFocus: onEnter,
                    onMouseLeave: onLeave,
                    onBlur: onLeave
                },
                iconStart: () => (
                    <span className={badgeStyles.alertCircle}>
                        <Icon iconName={badge.visual.iconName} />
                    </span>
                ),
                item: badge.visualRule,
                itemType: 'item',
                onClick: () =>
                    onItemClick(badge.visualRule, panelItem, badge.behavior),
                textPrimary: badge.visualRuleDisplayTitle
            };
            listItems.push(alertItem);
        });
    });
    return listItems;
}

interface IElementColoringProps {
    colorings: VisualColorings[];
    isModal: boolean;
    rowId: string;
}

const ElementColoring: React.FC<IElementColoringProps> = (props) => {
    const tooltipId = useId('cb-element-coloring-header-tooltip');
    const theme = useExtendedTheme();

    if (!props.isModal) {
        const tooltipContent = (colorings: VisualColorings[]) => {
            return <ColorPillsTooltip visualColorings={colorings} />;
        };

        return (
            <TooltipHost
                id={tooltipId}
                tooltipProps={{
                    onRenderContent: () => tooltipContent(props.colorings),
                    targetElement: document.getElementById(props.rowId)
                }}
                directionalHint={DirectionalHint.rightCenter}
                delay={TooltipDelay.zero}
                calloutProps={{
                    isBeakVisible: false,
                    gapSpace: 12,
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
                <ColorPills visualColorings={props.colorings} width={'wide'} />
            </TooltipHost>
        );
    } else {
        return <ColorPills visualColorings={props.colorings} width={'wide'} />;
    }
};

export default memo(VisualRuleElementsList);
