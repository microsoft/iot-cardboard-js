import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import {
    ActionButton,
    IContextualMenuItem,
    Stack,
    Text,
    useTheme
} from '@fluentui/react';
import produce from 'immer';
import { TFunction, useTranslation } from 'react-i18next';
import WidgetLibraryDialog from '../Widgets/WidgetLibraryDialog/WidgetLibraryDialog';
import { availableWidgets } from '../../../../../Models/Constants/Constants';
import { WidgetFormMode } from '../../../../../Models/Constants/Enums';
import { SceneBuilderContext } from '../../../ADT3DSceneBuilder';
import { CardboardList } from '../../../../CardboardList';
import {
    getActionButtonStyles,
    getLeftPanelStyles
} from '../../Shared/LeftPanel.styles';
import { ICardboardListItem } from '../../../../CardboardList/CardboardList.types';
import {
    IBehavior,
    IWidget
} from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import {
    defaultOnClickPopover,
    IWidgetLibraryItem,
    VisualType,
    WidgetType
} from '../../../../../Models/Classes/3DVConfig';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';
import { createGUID } from '../../../../../Models/Services/Utils';

const getPopoverFromBehavior = (behavior: IBehavior) =>
    behavior.visuals.filter(ViewerConfigUtility.isPopoverVisual)[0] || null;

const ROOT_LOC = '3dSceneBuilder.behaviorWidgetsForm';
const LOC_KEYS = {
    addButtonText: `${ROOT_LOC}.addWidgetButtonText`,
    noData: `${ROOT_LOC}.noData`,
    tabDescription: `${ROOT_LOC}.tabDescription`
};

const WidgetsTab: React.FC = () => {
    const { t } = useTranslation();
    const { setWidgetFormInfo, setBehaviorToEdit, behaviorToEdit } = useContext(
        SceneBuilderContext
    );
    const [isLibraryDialogOpen, setIsLibraryDialogOpen] = useState(false);
    const [listItems, setListItems] = useState<ICardboardListItem<IWidget>[]>(
        []
    );

    const widgets = useMemo(() => {
        return getPopoverFromBehavior(behaviorToEdit)?.widgets || [];
    }, [behaviorToEdit]);

    const onEditWidgetStart = useCallback(
        (id: string) => {
            const widget = widgets.find((w) => w.id === id);

            const matchingWidgetLibraryItem = availableWidgets.find(
                (aW) => aW.data.type === widget.type
            );

            const { iconName, title, description } = matchingWidgetLibraryItem;

            if (widget && matchingWidgetLibraryItem) {
                setWidgetFormInfo({
                    widget: {
                        iconName,
                        title,
                        description,
                        data: widget
                    },
                    mode: WidgetFormMode.EditWidget,
                    widgetId: id
                });
            }
        },
        [setWidgetFormInfo, widgets]
    );

    const onRemoveWidget = useCallback(
        (id: string) => {
            setBehaviorToEdit(
                produce((draft) => {
                    const popoverDraft = getPopoverFromBehavior(draft);
                    const indexOfWidgetToRemove = popoverDraft.widgets.findIndex(
                        (w) => w.id === id
                    );
                    popoverDraft.widgets.splice(indexOfWidgetToRemove, 1);

                    if (popoverDraft.widgets.length === 0) {
                        // If removing all widgets, remove popover container
                        const popOverIdx = draft.visuals.findIndex(
                            (v) => v.type === VisualType.Popover
                        );
                        draft.visuals.splice(popOverIdx, 1);
                    }
                })
            );
        },
        [setBehaviorToEdit]
    );

    const onWidgetAdd = useCallback(
        (libraryItem: IWidgetLibraryItem) => {
            setWidgetFormInfo({
                widget: libraryItem,
                mode: WidgetFormMode.CreateWidget,
                widgetId: createGUID()
            });

            // Add popover visual if not already present
            const popOver = getPopoverFromBehavior(behaviorToEdit);

            if (!popOver) {
                setBehaviorToEdit(
                    produce((draft) => {
                        draft.visuals.push(defaultOnClickPopover);
                    })
                );
            }
        },
        [setWidgetFormInfo, setBehaviorToEdit, behaviorToEdit]
    );

    // generate the list of items to show
    useEffect(() => {
        const listItems = getListItems(
            widgets,
            onEditWidgetStart,
            onRemoveWidget,
            t
        );
        setListItems(listItems);
    }, [widgets, onEditWidgetStart, onRemoveWidget, t]);

    const theme = useTheme();
    const commonPanelStyles = getLeftPanelStyles(theme);
    const actionButtonStyles = getActionButtonStyles(theme);
    return (
        <>
            <Stack tokens={{ childrenGap: 8 }}>
                <Text className={commonPanelStyles.text}>
                    {t(LOC_KEYS.tabDescription)}
                </Text>
                <div className={commonPanelStyles.formTabContents}>
                    {!widgets?.length ? (
                        <div className={commonPanelStyles.noDataText}>
                            {t(LOC_KEYS.noData)}
                        </div>
                    ) : (
                        <CardboardList<IWidget>
                            items={listItems}
                            listKey={'widgets-in-behavior'}
                        />
                    )}
                    <ActionButton
                        styles={actionButtonStyles}
                        text={t(LOC_KEYS.addButtonText)}
                        data-testid={'widgetForm-addWidget'}
                        onClick={() => {
                            setIsLibraryDialogOpen(true);
                        }}
                    />
                </div>
            </Stack>
            {isLibraryDialogOpen && (
                <WidgetLibraryDialog
                    setIsLibraryDialogOpen={setIsLibraryDialogOpen}
                    onAddWidget={(libraryItem: IWidgetLibraryItem) =>
                        onWidgetAdd(libraryItem)
                    }
                />
            )}
        </>
    );
};
function getListItems(
    filteredElements: IWidget[],
    onEditWidgetStart: (id: string) => void,
    onRemoveWidget: (id: string) => void,
    t: TFunction<string>
) {
    const getMenuItems = (item: IWidget): IContextualMenuItem[] => {
        return [
            {
                key: 'edit',
                'data-testid': 'editWidgetOverflow',
                text: t('3dSceneBuilder.editWidget'),
                iconProps: { iconName: 'Edit' },
                onClick: () => onEditWidgetStart(item.id)
            },
            {
                key: 'remove',
                'data-testid': 'removeWidgetOverflow',
                text: t('3dSceneBuilder.removeWidget'),
                iconProps: { iconName: 'Delete' },
                onClick: () => onRemoveWidget(item.id)
            }
        ];
    };
    const getWidgetLabel = (widget: IWidget) => {
        switch (widget.type) {
            case WidgetType.Gauge:
            case WidgetType.Link:
                return widget?.widgetConfiguration?.label;
            case WidgetType.Value:
                return widget?.widgetConfiguration?.displayName;
            default:
                return widget.type;
        }
    };
    const getIconName = (widget: IWidget) =>
        availableWidgets.find((w) => w.data.type === widget.type)?.iconName;
    return filteredElements.map((item) => {
        const viewModel: ICardboardListItem<IWidget> = {
            ariaLabel: '',
            iconStart: { name: getIconName(item) },
            item: item,
            openMenuOnClick: true,
            overflowMenuItems: getMenuItems(item),
            textPrimary: getWidgetLabel(item)
        };

        return viewModel;
    });
}

export default WidgetsTab;
