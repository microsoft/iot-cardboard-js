import React, { useState } from 'react';
import {
    IDialogContentProps,
    DialogType,
    IModalProps,
    Dialog,
    DefaultButton,
    DialogFooter,
    FontIcon,
    Label,
    List,
    Pivot,
    PivotItem,
    PrimaryButton
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { IWidgetLibraryItem } from '../../../../../../Models/Classes/3DVConfig';
import { availableWidgets } from '../../../../../../Models/Constants/Constants';
import { getWidgetLibraryDialogStyles } from './WidgetLibraryDialog.styles';

const enabledWidgets = availableWidgets.filter((w) => !w.disabled);

const WidgetLibraryDialog: React.FC<{
    setIsLibraryDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onAddWidget: (libraryItem: IWidgetLibraryItem) => void;
}> = ({ setIsLibraryDialogOpen: setIsLibraryDialogOpen, onAddWidget }) => {
    const [selectedWidget, setSelectedWidget] = useState<number>(null);
    const [filteredAvailableWidgets, setFilteredAvailableWidgets] = useState(
        enabledWidgets
    );
    const { t } = useTranslation();
    const styles = getWidgetLibraryDialogStyles();

    const dialogContentProps: IDialogContentProps = {
        type: DialogType.close,
        title: t('3dSceneBuilder.widgetLibrary'),
        styles: {
            content: styles.content
        }
    };

    const modalProps: IModalProps = {
        isBlocking: false,
        containerClassName: 'cb-widget-dialog-modal',
        isDarkOverlay: false,
        styles: {
            scrollableContent: styles.scrollableContent
        }
    };

    return (
        <Dialog
            dialogContentProps={dialogContentProps}
            modalProps={modalProps}
            hidden={false}
            onDismiss={() => setIsLibraryDialogOpen(false)}
        >
            <Label className="cb-widget-panel-item-label">
                {t('3dSceneBuilder.exploreWidgets')}
            </Label>
            <Pivot className="cb-widget-panel-widgets">
                <PivotItem headerText={t('3dSceneBuilder.allWidgets')}>
                    <div className="cb-widget-library-dialog-list-container">
                        <List
                            items={filteredAvailableWidgets}
                            onRenderCell={(widget, index) => (
                                <div
                                    key={index}
                                    className={`cb-widget-dialog-list-item ${
                                        index === selectedWidget
                                            ? 'cb-widget-dialog-list-item-selected'
                                            : ''
                                    }`}
                                    onClick={() => {
                                        setSelectedWidget(index);
                                        setFilteredAvailableWidgets([
                                            ...enabledWidgets
                                        ]);
                                    }}
                                    data-testid={`widget-library-${widget.data.type}`}
                                >
                                    <div className="cb-widget-dialog-list-item-content">
                                        <div className="cb-widget-dialog-icon-background">
                                            <FontIcon
                                                className="cb-widget-dialog-icon"
                                                iconName={widget.iconName}
                                            />
                                        </div>
                                        <div>
                                            <Label>{widget.data.type}</Label>
                                            <Label className="cb-widget-panel-item-label">
                                                {widget.description}
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        ></List>
                        <div className="cb-widget-panel-clear-float" />
                    </div>
                </PivotItem>
            </Pivot>
            <DialogFooter>
                <PrimaryButton
                    data-testid={'widget-library-add-button'}
                    disabled={selectedWidget === null}
                    onClick={() => {
                        setIsLibraryDialogOpen(false);
                        onAddWidget(enabledWidgets[selectedWidget]);
                    }}
                    text={t('3dSceneBuilder.addWidget')}
                />
                <DefaultButton
                    data-testid={'widget-library-cancel-button'}
                    onClick={() => setIsLibraryDialogOpen(false)}
                    text={t('cancel')}
                />
            </DialogFooter>
        </Dialog>
    );
};

export default WidgetLibraryDialog;
