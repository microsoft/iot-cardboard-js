import { Icon } from '@fluentui/react';
import React, {
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { useTranslation } from 'react-i18next';
import ViewerConfigUtility from '../../../Models/Classes/ViewerConfigUtility';
import {
    wrapTextInTemplateString,
    parseLinkedTwinExpression,
    sortAscendingOrDescending
} from '../../../Models/Services/Utils';
import {
    IBehavior,
    IExpressionRangeVisual,
    ITwinToObjectMapping,
    IValueRangeVisual,
    IVisual
} from '../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { ICardboardGroupedListItem } from '../../CardboardList/CardboardGroupedList.types';
import { CardboardList } from '../../CardboardList/CardboardList';
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
import {
    hasBadge,
    shouldShowVisual
} from '../../../Models/SharedUtils/VisualRuleUtils';
import { VisualColorings } from '../../../Models/Constants/VisualRuleTypes';
import ElementColoring from './ElementColoring';

type ViewerElementsPanelCallback = (
    rowId: string,
    item: ITwinToObjectMapping,
    panelItem: IViewerElementsPanelItem,
    behavior?: IBehavior
) => void;

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

    // State
    const [openCalloutRowId, setOpenCalloutRowId] = useState('');

    // Callbacks
    const onItemHoverExtend = useCallback(
        (
            rowId: string,
            element: ITwinToObjectMapping,
            panelItem: IViewerElementsPanelItem
        ) => {
            setOpenCalloutRowId(rowId);
            if (onItemHover) {
                onItemHover(element, panelItem);
            }
        },
        [onItemHover]
    );

    const onItemBlurExtended = useCallback(
        (
            rowId: string,
            element: ITwinToObjectMapping,
            panelItem: IViewerElementsPanelItem
        ) => {
            setOpenCalloutRowId('');
            if (onItemBlur) {
                onItemBlur(element, panelItem);
            }
        },
        [onItemBlur]
    );

    const listItems = useMemo(
        () =>
            getListItems(
                panelItems,
                isModal,
                openCalloutRowId,
                onItemClick,
                onItemHover,
                onItemBlur,
                onItemHoverExtend,
                onItemBlurExtended
            ),
        [
            panelItems,
            onItemClick,
            onItemHover,
            onItemBlur,
            onItemHoverExtend,
            onItemBlurExtended,
            openCalloutRowId,
            isModal
        ]
    );

    return (
        <div className={elementsPanelStyles.list}>
            {isLoading && !isInitialDataLoaded.current ? (
                <p className={elementsPanelStyles.message}>{t('loading')}</p>
            ) : panelItems.length === 0 ? (
                <p className={elementsPanelStyles.message}>
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
    openCalloutRowId: string,
    onItemClick: ElementsPanelCallback,
    onItemHover: ElementsPanelCallback,
    onItemBlur: ElementsPanelCallback,
    onItemHoverExtended: ViewerElementsPanelCallback,
    onItemBlurExtended: ViewerElementsPanelCallback
): Array<ICardboardGroupedListItem<ITwinToObjectMapping | IVisual>> {
    const sortedPanelItems = sortPanelItemsForDisplay(panelItems);
    const buttonStyles = getElementsPanelButtonSyles();
    const listItems: Array<
        ICardboardGroupedListItem<ITwinToObjectMapping | IVisual>
    > = [];

    sortedPanelItems.forEach((panelItem) => {
        const element = panelItem.element;
        const elementColorings: Array<VisualColorings> = [];
        const badges: Array<{
            behavior: IBehavior;
            visual: IValueRangeVisual;
            visualRule: IExpressionRangeVisual;
            visualRuleDisplayTitle: string;
        }> = [];
        let visualRules: IExpressionRangeVisual[] = [];

        panelItem.behaviors.forEach((b) => {
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
                        if (hasBadge(condition)) {
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
        badges.sort(sortAscendingOrDescending('visualRuleDisplayTitle'));

        const rowId = `cb-element-list-row-${element.id}`;
        const elementItemWithColorings: ICardboardGroupedListItem<ITwinToObjectMapping> = {
            id: rowId,
            ariaLabel: element.displayName,
            buttonProps: {
                customStyles: buttonStyles.elementButton,
                onMouseEnter: () =>
                    onItemHoverExtended(rowId, element, panelItem),
                onFocus: () => onItemHoverExtended(rowId, element, panelItem),
                onMouseLeave: () =>
                    onItemBlurExtended(rowId, element, panelItem),
                onBlur: () => onItemBlurExtended(rowId, element, panelItem)
            },
            iconStart: () => (
                <ElementColoring
                    rowId={rowId}
                    colorings={elementColorings}
                    isModal={isModal}
                    isCalloutOpen={rowId === openCalloutRowId}
                />
            ),
            item: element,
            itemType: 'header',
            onClick: () => onItemClick(element, panelItem),
            textPrimary: element.displayName
        };
        listItems.push(elementItemWithColorings);

        badges.forEach((badge) => {
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

export default memo(VisualRuleElementsList);
