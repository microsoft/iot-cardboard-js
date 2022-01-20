import React, { useContext, useState } from 'react';
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
import { availableWidgets, WidgetFormMode } from '../../../..';
import {
    VisualType,
    IWidgetLibraryItem
} from '../../../../Models/Classes/3DVConfig';
import WidgetLibraryDialog from './WidgetLibraryDialogue';
import { BehaviorFormContext } from './BehaviorsForm';

const BehaviorFormWidgetsTab: React.FC = () => {
    const {
        setBehaviorToEdit,
        setWidgetFormInfo,
        draftWidgets,
        setDraftWidgets
    } = useContext(BehaviorFormContext);

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
            const wids = [...draftWidgets];
            wids.splice(index, 1);
            setBehaviorToEdit(
                produce((draft) => {
                    const popOver = draft?.visuals?.find(
                        (visual) => visual.type === VisualType.OnClickPopover
                    );
                    popOver.widgets = wids;
                    setDraftWidgets(wids);
                })
            );
        }
    }

    function onWidgetAdd(libraryItem: IWidgetLibraryItem) {
        setWidgetFormInfo({ widget: libraryItem, mode: WidgetFormMode.Create });
        // const wids = widgets ? [...widgets] : [];
        // wids.push(data);
        // setBehaviorToEdit(
        //     produce((draft) => {
        //         const popOver = draft?.visuals?.find(
        //             (visual) => visual.type === VisualType.OnClickPopover
        //         );
        //         if (popOver) {
        //             popOver.widgets = wids; // TODO: Add popOver if not there
        //             setWidgets(wids);
        //         }
        //     })
        // );
    }

    return (
        <div className="cb-widget-panel-container">
            {!draftWidgets?.length && (
                <Label className="cb-widget-panel-label">
                    {t('3dSceneBuilder.noWidgetsConfigured')}
                </Label>
            )}
            {draftWidgets?.length > 0 &&
                draftWidgets.map((widget, index) => (
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
