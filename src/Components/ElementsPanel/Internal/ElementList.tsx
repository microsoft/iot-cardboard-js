import {
    Icon,
    IStyle,
    memoizeFunction,
    mergeStyleSets,
    Separator
} from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ViewerConfigUtility from '../../../Models/Classes/ViewerConfigUtility';
import { DTwin } from '../../../Models/Constants/Interfaces';
import { parseExpression } from '../../../Models/Services/Utils';
import {
    IAlertVisual,
    IStatusColoringVisual,
    ITwinToObjectMapping,
    IVisual
} from '../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { CardboardList } from '../../CardboardList/CardboardList';
import { ICardboardListItem } from '../../CardboardList/CardboardList.types';
import { performSubstitutions } from '../../Widgets/Widget.Utils';

interface ElementListProps {
    panelItems: Array<ElementsPanelItem>;
    onItemClick: (
        item: ITwinToObjectMapping | IVisual,
        meshIds: Array<string>
    ) => void;
    onItemHover: (item: ITwinToObjectMapping | IVisual) => void;
}

export interface ElementsPanelItem {
    element: ITwinToObjectMapping;
    visuals: Array<IVisual>;
    twins: Record<string, DTwin>;
    meshIds: Array<string>;
}

const ElementList: React.FC<ElementListProps> = (props) => {
    const { t } = useTranslation();
    const elementListStyles = getElementListStyles();

    return (
        <div className={elementListStyles.list}>
            {props.panelItems.length === 0 ? (
                <div style={{ padding: '0px 20px' }}>
                    {t('elementsPanel.noElements')}
                </div>
            ) : (
                <>
                    <Separator styles={{ root: { padding: 0, height: 1 } }} />
                    {props.panelItems.map((elementListItem, idx) => (
                        <>
                            <CardboardList<ITwinToObjectMapping | IVisual>
                                key={`cb-elements-panel-item-${elementListItem.element.displayName}`}
                                items={getListItems(
                                    elementListItem,
                                    props.onItemClick,
                                    props.onItemHover
                                )}
                                listKey={`elements-panel`}
                            />
                            {idx < props.panelItems.length - 1 && (
                                <Separator
                                    key={`cb-elements-panel-separator-${elementListItem.element.displayName}`}
                                    styles={{ root: { padding: 0, height: 1 } }}
                                />
                            )}
                        </>
                    ))}
                </>
            )}
        </div>
    );
};

function getListItems(
    panelItem: ElementsPanelItem,
    onItemClick: (
        item: ITwinToObjectMapping | IVisual,
        meshIds: Array<string>
    ) => void,
    onItemHover: (item: ITwinToObjectMapping | IVisual) => void
): ICardboardListItem<ITwinToObjectMapping | IVisual>[] {
    const listItems: Array<
        ICardboardListItem<ITwinToObjectMapping | IVisual>
    > = [];

    const element = panelItem.element;
    const status = panelItem.visuals.find(
        (v) => v.type === 'StatusColoring'
    ) as IStatusColoringVisual;
    const alerts = panelItem.visuals.filter(
        (v) => v.type === 'Alert'
    ) as Array<IAlertVisual>;

    const statusStyle = getStatusStyle(
        getStatusColor(
            status.statusValueExpression,
            status.valueRanges,
            panelItem.twins
        )
    );

    const elementItemWithStatus: ICardboardListItem<ITwinToObjectMapping> = {
        ariaLabel: element.displayName,
        buttonProps: {
            onMouseOver: () => onItemHover(element),
            onBlur: () => onItemHover(element)
        },
        iconStartName: <div className={statusStyle.statusLine}></div>,
        item: element,
        onClick: () => onItemClick(element, panelItem.meshIds),
        textPrimary: element.displayName
    };
    listItems.push(elementItemWithStatus);

    alerts.map((alert) => {
        const alertStyle = getAlertStyle(alert.color);
        if (parseExpression(alert.triggerExpression, panelItem.twins)) {
            const alertItem: ICardboardListItem<IAlertVisual> = {
                ariaLabel: performSubstitutions(
                    alert.labelExpression,
                    panelItem.twins
                ),
                buttonProps: {
                    onMouseOver: () => onItemHover(element),
                    onBlur: () => onItemHover(element)
                },
                iconStartName: (
                    <span className={alertStyle.alertCircle}>
                        <Icon iconName={alert.iconName} />
                    </span>
                ),
                item: alert,
                onClick: () => onItemClick(alert, panelItem.meshIds),
                textPrimary: performSubstitutions(
                    alert.labelExpression,
                    panelItem.twins
                )
            };
            listItems.push(alertItem);
        }
    });

    return listItems;
}

const getElementListStyles = memoizeFunction(() => {
    return mergeStyleSets({
        list: {
            width: '100%',
            height: '100%'
        }
    });
});

const getStatusStyle = memoizeFunction((statusColor: string) => {
    return mergeStyleSets({
        statusLine: {
            width: 5,
            height: 3,
            boxShadow: `0px 0px 4px ${statusColor}`,
            background: statusColor,
            margin: '0px 16px'
        } as IStyle
    });
});

const getAlertStyle = memoizeFunction((alertColor: string) => {
    return mergeStyleSets({
        alertCircle: {
            width: 24,
            height: 24,
            borderRadius: 30,
            backgroundColor: alertColor,
            margin: '0 6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        } as IStyle
    });
});

const getStatusColor = (statusValueExpression, valueRanges, twins) => {
    const value = parseExpression(statusValueExpression, twins);
    return ViewerConfigUtility.getColorOrNullFromStatusValueRange(
        valueRanges,
        value
    );
};

export default ElementList;
