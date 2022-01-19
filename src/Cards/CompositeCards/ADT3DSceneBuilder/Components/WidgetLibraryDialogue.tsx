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
    PrimaryButton,
    SearchBox
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { availableWidgets } from '../../../../Models/Constants/Constants';

const WidgetLibraryDialog: React.FC<{
    setIsLibraryDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onAddWidget: (config: any) => void;
}> = ({ setIsLibraryDialogOpen: setIsLibraryDialogOpen, onAddWidget }) => {
    const [selectedWidget, setSelectedWidget] = useState<number>(null);
    const [filteredAvailableWidgets, setFilteredAvailableWidgets] = useState(
        availableWidgets
    );
    const { t } = useTranslation();

    const dialogContentProps: IDialogContentProps = {
        type: DialogType.close,
        title: t('3dSceneBuilder.widgetLibrary')
    };

    const modalProps: IModalProps = {
        isBlocking: false,
        containerClassName: 'cb-widget-dialog-modal',
        isDarkOverlay: false
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
            <SearchBox
                className="cb-widget-dialog-search-box"
                placeholder={t('3dSceneBuilder.searchWidgets')}
            />
            <Pivot>
                <PivotItem headerText={t('3dSceneBuilder.allWidgets')}>
                    <div>
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
                                            ...availableWidgets
                                        ]);
                                    }}
                                >
                                    <div className="cb-widget-dialog-list-item-content">
                                        <div className="cb-widget-dialog-icon-background">
                                            <FontIcon
                                                className="cb-widget-dialog-icon"
                                                iconName={widget.iconName}
                                            />
                                        </div>
                                        <div>
                                            <Label>{widget.type}</Label>
                                            <Label className="cb-widget-panel-item-label">
                                                {t(widget.description)}
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        ></List>
                        <div className="cb-widget-panel-clear-float" />
                    </div>
                </PivotItem>
                <PivotItem headerText={t('3dSceneBuilder.myWidgets')}>
                    <Label className="cb-widget-panel-no-widgets">
                        {t('3dSceneBuilder.noWidgets')}
                    </Label>
                </PivotItem>
            </Pivot>
            <DialogFooter>
                <PrimaryButton
                    disabled={!selectedWidget}
                    onClick={() => {
                        setIsLibraryDialogOpen(false);
                        onAddWidget(availableWidgets[selectedWidget].data);
                    }}
                    text={t('3dSceneBuilder.addWidget')}
                />
                <DefaultButton
                    onClick={() => setIsLibraryDialogOpen(false)}
                    text={t('cancel')}
                />
            </DialogFooter>
        </Dialog>
    );
};

export default WidgetLibraryDialog;
