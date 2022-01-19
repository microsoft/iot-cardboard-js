import React, { useState } from 'react';
import {
    IContextualMenuProps,
    IContextualMenuItem,
    Label,
    ActionButton,
    FontIcon,
    IconButton
} from '@fluentui/react';
import produce from 'immer';
import { useTranslation } from 'react-i18next';
import { availableWidgets } from '../../../..';
import {
    IBehavior,
    VisualType,
    IWidget
} from '../../../../Models/Classes/3DVConfig';
import WidgetLibraryDialog from './WidgetLibraryDialogue';

const BehaviorFormWidgetsTab: React.FC<{
    behaviorToEdit: IBehavior;
    setBehaviorToEdit: React.Dispatch<React.SetStateAction<IBehavior>>;
}> = ({ behaviorToEdit, setBehaviorToEdit }) => {
    const popOver = behaviorToEdit?.visuals?.find(
        (visual) => visual.type === VisualType.OnClickPopover
    );
    const [widgets, setWidgets] = useState<IWidget[]>(popOver?.widgets);
    const [isLibraryDialogOpen, setIsLibraryDialogOpen] = useState(false);
    const { t } = useTranslation();

    function getMenuProps(index: number): IContextualMenuProps {
        return {
            items: [
                {
                    key: 'edit',
                    text: t('3dSceneBuilder.editWidget'),
                    iconProps: { iconName: 'Edit' },
                    onClick: (ev, item) => onMenuClick(index, item)
                },
                {
                    key: 'remove',
                    text: t('3dSceneBuilder.removeWidget'),
                    iconProps: { iconName: 'Delete' },
                    onClick: (ev, item) => onMenuClick(index, item)
                }
            ]
        };
    }

    function onMenuClick(index: number, item: IContextualMenuItem) {
        if (item.key === 'remove') {
            const wids = [...widgets];
            wids.splice(index, 1);
            setBehaviorToEdit(
                produce((draft) => {
                    const popOver = draft?.visuals?.find(
                        (visual) => visual.type === VisualType.OnClickPopover
                    );
                    popOver.widgets = wids;
                    setWidgets(wids);
                })
            );
        }
    }

    function onWidgetAdd(data: any) {
        const wids = widgets ? [...widgets] : [];
        wids.push(data);
        setBehaviorToEdit(
            produce((draft) => {
                const popOver = draft?.visuals?.find(
                    (visual) => visual.type === VisualType.OnClickPopover
                );
                if (popOver) {
                    popOver.widgets = wids; // TODO: Add popOver if not there
                    setWidgets(wids);
                }
            })
        );
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
                                    (w) => w.type === widget.type
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
                    onAddWidget={(data) => onWidgetAdd(data)}
                />
            )}
        </div>
    );
};

export default BehaviorFormWidgetsTab;
