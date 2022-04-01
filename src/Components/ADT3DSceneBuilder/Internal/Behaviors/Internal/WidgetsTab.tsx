// TODO SCHEMA MIGRATION - update Widgets tab to new schema & types
import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import { ActionButton, IContextualMenuItem, useTheme } from '@fluentui/react';
import produce from 'immer';
import { TFunction, useTranslation } from 'react-i18next';
import { BehaviorFormContext } from '../BehaviorsForm';
import WidgetLibraryDialog from '../Widgets/WidgetLibraryDialog';
import { availableWidgets } from '../../../../../Models/Constants/Constants';
import { WidgetFormMode } from '../../../../../Models/Constants/Enums';
import { SceneBuilderContext } from '../../../ADT3DSceneBuilder';
import { CardboardList } from '../../../../CardboardList';
import { getLeftPanelStyles } from '../../Shared/LeftPanel.styles';
import { ICardboardListItem } from '../../../../CardboardList/CardboardList.types';
import {
    IBehavior,
    IWidget
} from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import {
    defaultOnClickPopover,
    IWidgetLibraryItem,
    VisualType
} from '../../../../../Models/Classes/3DVConfig';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';

const getPopoverFromBehavior = (behavior: IBehavior) =>
    behavior.visuals.filter(ViewerConfigUtility.isPopoverVisual)[0] || null;

const WidgetsTab: React.FC = () => {
    const { t } = useTranslation();
    const { setWidgetFormInfo } = useContext(SceneBuilderContext);
    const { setBehaviorToEdit, behaviorToEdit } = useContext(
        BehaviorFormContext
    );
    const [isLibraryDialogOpen, setIsLibraryDialogOpen] = useState(false);
    const [listItems, setListItems] = useState<ICardboardListItem<IWidget>[]>(
        []
    );

    const widgets = useMemo(() => {
        return getPopoverFromBehavior(behaviorToEdit)?.widgets || [];
    }, [behaviorToEdit]);

    const onEditWidgetStart = useCallback(
        (index: number) => {
            const widget = widgets[index];

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
                    widgetIdx: index
                });
            }
        },
        [setWidgetFormInfo]
    );

    const onRemoveWidget = useCallback(
        (index: number) => {
            const wids = [...widgets];
            wids.splice(index, 1);
            setBehaviorToEdit(
                produce((draft) => {
                    const popoverDraft = getPopoverFromBehavior(draft);
                    popoverDraft.widgets = wids;

                    if (wids.length === 0) {
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
                mode: WidgetFormMode.CreateWidget
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
        [setWidgetFormInfo, setBehaviorToEdit]
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
    }, [widgets, onEditWidgetStart, onRemoveWidget]);

    const commonPanelStyles = getLeftPanelStyles(useTheme());
    return (
        <>
            <div className={commonPanelStyles.formTabContents}>
                {!widgets?.length ? (
                    <div className={commonPanelStyles.noDataText}>
                        {t('3dSceneBuilder.noWidgetsConfigured')}
                    </div>
                ) : (
                    <CardboardList<IWidget>
                        items={listItems}
                        listKey={'widgets-in-behavior'}
                    />
                )}
                <ActionButton
                    className="cb-widget-panel-action-button"
                    text={t('3dSceneBuilder.addWidget')}
                    data-testid={'widgetForm-addWidget'}
                    onClick={() => {
                        setIsLibraryDialogOpen(true);
                    }}
                />
            </div>
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
    onEditWidgetStart: (index: number) => void,
    onRemoveWidget: (index: number) => void,
    t: TFunction<string>
) {
    const getMenuItems = (
        _item: IWidget,
        index: number
    ): IContextualMenuItem[] => {
        return [
            {
                key: 'edit',
                'data-testid': 'editWidgetOverflow',
                text: t('3dSceneBuilder.editWidget'),
                iconProps: { iconName: 'Edit' },
                onClick: () => onEditWidgetStart(index)
            },
            {
                key: 'remove',
                'data-testid': 'removeWidgetOverflow',
                text: t('3dSceneBuilder.removeWidget'),
                iconProps: { iconName: 'Delete' },
                onClick: () => onRemoveWidget(index)
            }
        ];
    };
    const getIconName = (widget: IWidget) =>
        availableWidgets.find((w) => w.data.type === widget.type)?.iconName;
    return filteredElements.map((item, index) => {
        const viewModel: ICardboardListItem<IWidget> = {
            ariaLabel: '',
            iconStart: { name: getIconName(item) },
            item: item,
            openMenuOnClick: true,
            overflowMenuItems: getMenuItems(item, index),
            textPrimary: item?.widgetConfiguration?.label || item.type
        };

        return viewModel;
    });
}

export default WidgetsTab;
