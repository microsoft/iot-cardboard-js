import React, { useCallback, useContext, useMemo, useState } from 'react';
import {
    Label,
    ActionButton,
    IContextualMenuItem,
    memoizeFunction,
    Theme,
    IStyle,
    mergeStyleSets,
    FontSizes,
    useTheme
} from '@fluentui/react';
import produce from 'immer';
import { useTranslation } from 'react-i18next';
import {
    VisualType,
    IWidgetLibraryItem,
    defaultOnClickPopover,
    IWidget
} from '../../../../../Models/Classes/3DVConfig';
import { BehaviorFormContext } from '../BehaviorsForm';
import WidgetLibraryDialog from '../Widgets/WidgetLibraryDialog';
import { availableWidgets } from '../../../../../Models/Constants/Constants';
import { WidgetFormMode } from '../../../../../Models/Constants/Enums';
import { SceneBuilderContext } from '../../../ADT3DSceneBuilder';
import {
    CardboardList,
    CardboardListItemProps
} from '../../../../CardboardList';
import { getLeftPanelStyles } from '../../Shared/LeftPanel.styles';

const WidgetsTab: React.FC = () => {
    const { setWidgetFormInfo } = useContext(SceneBuilderContext);

    const { setBehaviorToEdit, behaviorToEdit } = useContext(
        BehaviorFormContext
    );

    const [isLibraryDialogOpen, setIsLibraryDialogOpen] = useState(false);
    const { t } = useTranslation();

    const widgets = useMemo(() => {
        return (
            behaviorToEdit?.visuals?.find(
                (visual) => visual.type === VisualType.OnClickPopover
            )?.widgets || []
        );
    }, [behaviorToEdit]);

    const onEditWidgetStart = (index: number) => {
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
    };

    const onRemoveWidget = (index: number) => {
        const wids = [...widgets];
        wids.splice(index, 1);
        setBehaviorToEdit(
            produce((draft) => {
                const popOver = draft?.visuals?.find(
                    (visual) => visual.type === VisualType.OnClickPopover
                );
                popOver.widgets = wids;

                if (wids.length === 0 && popOver) {
                    // If removing all widgets, remove popover container
                    const popOverIdx = draft.visuals.findIndex(
                        (v) => v.type === VisualType.OnClickPopover
                    );
                    draft.visuals.splice(popOverIdx, 1);
                }
            })
        );
    };

    function onWidgetAdd(libraryItem: IWidgetLibraryItem) {
        setWidgetFormInfo({
            widget: libraryItem,
            mode: WidgetFormMode.CreateWidget
        });

        // Add popover visual if not already present
        const popOver = behaviorToEdit.visuals?.find(
            (v) => v.type === VisualType.OnClickPopover
        );
        if (!popOver) {
            setBehaviorToEdit(
                produce((draft) => {
                    draft.visuals.push(defaultOnClickPopover);
                })
            );
        }
    }

    const getOverflowMenuItems = (
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
    const getIconName = useCallback(
        (widget: IWidget) =>
            availableWidgets.find((w) => w.data.type === widget.type)?.iconName,
        [availableWidgets]
    );
    const getListItemProps = (
        item: IWidget,
        index: number
    ): CardboardListItemProps<IWidget> => {
        return {
            ariaLabel: '',
            iconStartName: getIconName(item),
            openMenuOnClick: true,
            overflowMenuItems: getOverflowMenuItems(item, index),
            textPrimary: item.type
        };
    };

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
                        items={widgets}
                        getListItemProps={getListItemProps}
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

export default WidgetsTab;
