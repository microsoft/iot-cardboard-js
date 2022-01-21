import React, { useContext, useMemo, useState } from 'react';
import {
    IContextualMenuProps,
    Label,
    ActionButton,
    FontIcon,
    IconButton
} from '@fluentui/react';
import produce from 'immer';
import { useTranslation } from 'react-i18next';
import {
    VisualType,
    IWidgetLibraryItem,
    defaultOnClickPopover
} from '../../../../../../Models/Classes/3DVConfig';
import { BehaviorFormContext } from '../BehaviorsForm';
import WidgetLibraryDialog from '../Widgets/WidgetLibraryDialog';
import { availableWidgets } from '../../../../../../Models/Constants/Constants';
import { WidgetFormMode } from '../../../../../../Models/Constants/Enums';

const BehaviorFormWidgetsTab: React.FC = () => {
    const { setBehaviorToEdit, setWidgetFormInfo, behaviorToEdit } = useContext(
        BehaviorFormContext
    );

    const [isLibraryDialogOpen, setIsLibraryDialogOpen] = useState(false);
    const { t } = useTranslation();

    function getMenuProps(index: number): IContextualMenuProps {
        return {
            items: [
                {
                    key: 'edit',
                    text: t('3dSceneBuilder.editWidget'),
                    iconProps: { iconName: 'Edit' },
                    onClick: () => onEditWidgetStart(index)
                },
                {
                    key: 'remove',
                    text: t('3dSceneBuilder.removeWidget'),
                    iconProps: { iconName: 'Delete' },
                    onClick: () => onRemoveWidget(index)
                }
            ]
        };
    }

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
                mode: WidgetFormMode.Edit,
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
        setWidgetFormInfo({ widget: libraryItem, mode: WidgetFormMode.Create });

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

    return (
        <div className="cb-widget-panel-container">
            {!widgets?.length && (
                <Label className="cb-widget-panel-label">
                    {t('3dSceneBuilder.noWidgetsConfigured')}
                </Label>
            )}
            {widgets?.length > 0 &&
                widgets.map((widget, index) => (
                    <div key={index} className="cb-widget-panel-list-container">
                        <FontIcon
                            className="cb-widget-panel-list-icon"
                            iconName={
                                availableWidgets.find(
                                    (w) => w.data.type === widget.type
                                )?.iconName
                            }
                        />
                        <Label className="cb-widget-panel-list-label">
                            {widget.type}
                        </Label>
                        <div className="cb-widget-panel-flex1" />
                        <IconButton
                            menuIconProps={{
                                iconName: 'MoreVertical',
                                style: {
                                    fontWeight: 'bold',
                                    fontSize: 18,
                                    color: 'black'
                                }
                            }}
                            menuProps={getMenuProps(index)}
                        />
                    </div>
                ))}
            <ActionButton
                className="cb-widget-panel-action-button"
                text={t('3dSceneBuilder.addWidget')}
                onClick={() => {
                    setIsLibraryDialogOpen(true);
                }}
            />
            {isLibraryDialogOpen && (
                <WidgetLibraryDialog
                    setIsLibraryDialogOpen={setIsLibraryDialogOpen}
                    onAddWidget={(libraryItem: IWidgetLibraryItem) =>
                        onWidgetAdd(libraryItem)
                    }
                />
            )}
        </div>
    );
};

export default BehaviorFormWidgetsTab;
