import React, { useCallback, useContext, useState } from 'react';
import {
    css,
    DefaultButton,
    Dialog,
    DialogFooter,
    DialogType,
    FontIcon,
    FontSizes,
    IDialogContentProps,
    IModalProps,
    Label,
    Link,
    List,
    PrimaryButton,
    Spinner,
    SpinnerSize,
    Stack,
    Text
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import {
    IWidgetLibraryItem,
    WidgetType
} from '../../../../../../Models/Classes/3DVConfig';
import {
    availableWidgets,
    LOCAL_STORAGE_KEYS
} from '../../../../../../Models/Constants/Constants';
import { getWidgetLibraryDialogStyles } from './WidgetLibraryDialog.styles';
import { ADT3DScenePageContext } from '../../../../../../Pages/ADT3DScenePage/ADT3DScenePage';
import { ADXConnectionInformationLoadingState } from '../../../../../../Pages/ADT3DScenePage/ADT3DScenePage.types';

const enabledWidgets = availableWidgets.filter((w) => !w.disabled);
if (
    enabledWidgets.findIndex((w) => w.data.type === WidgetType.DataHistory) ===
        -1 &&
    localStorage.getItem(
        LOCAL_STORAGE_KEYS.FeatureFlags.DataHistory.showDataHistoryWidget
    ) === 'true'
) {
    // when data history is disabled in code but enabled by local storage externally to test the feature append it to the list
    enabledWidgets.push(
        availableWidgets.find((w) => w.data.type === WidgetType.DataHistory)
    );
}

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
    const scenePageContext = useContext(ADT3DScenePageContext);

    const dialogContentProps: IDialogContentProps = {
        type: DialogType.close,
        title: t('3dSceneBuilder.widgetLibrary.dialogTitle'),
        subText: t('3dSceneBuilder.widgetLibrary.dialogSubTitle'),
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

    const isSpinnerVisible = useCallback(
        (widgetType: WidgetType) =>
            widgetType === WidgetType.DataHistory &&
            scenePageContext?.state.adxConnectionInformation?.loadingState ===
                ADXConnectionInformationLoadingState.LOADING,
        [scenePageContext?.state.adxConnectionInformation?.loadingState]
    );

    const isWidgetAvailable = useCallback(
        (widgetType: WidgetType) =>
            !(
                widgetType === WidgetType.DataHistory &&
                scenePageContext?.state.adxConnectionInformation
                    ?.loadingState ===
                    ADXConnectionInformationLoadingState.NOT_EXIST
            ),
        [scenePageContext?.state.adxConnectionInformation?.loadingState]
    );

    const isWidgetButtonDisabled = useCallback(
        (widgetType: WidgetType) =>
            widgetType === WidgetType.DataHistory &&
            scenePageContext?.state.adxConnectionInformation?.loadingState !==
                ADXConnectionInformationLoadingState.EXIST,
        [scenePageContext?.state.adxConnectionInformation?.loadingState]
    );

    const handleOnRenderCell = useCallback(
        (widget: IWidgetLibraryItem, index: number) => (
            <DefaultButton
                disabled={isWidgetButtonDisabled(
                    widget.data.type as WidgetType
                )}
                key={index}
                className={css(
                    'cb-widget-dialog-list-item',
                    index === selectedWidget
                        ? 'cb-widget-dialog-list-item-selected'
                        : ''
                )}
                onClick={() => {
                    setSelectedWidget(index);
                    setFilteredAvailableWidgets([...enabledWidgets]);
                }}
                data-testid={`widget-library-${widget.data.type}`}
                styles={{
                    flexContainer: { justifyContent: 'start' }
                }}
                selected={index === selectedWidget}
            >
                <Stack horizontal>
                    <Stack
                        className="cb-widget-dialog-icon-container"
                        aria-hidden={true}
                    >
                        {isSpinnerVisible(widget.data.type as WidgetType) ? (
                            <Spinner size={SpinnerSize.large} />
                        ) : (
                            <FontIcon
                                className="cb-widget-dialog-icon"
                                iconName={widget.iconName}
                            />
                        )}
                    </Stack>
                    <Stack
                        styles={{
                            root: {
                                alignItems: 'start',
                                textAlign: 'left'
                            }
                        }}
                    >
                        <Label>{widget.data.type}</Label>
                        <Text
                            styles={{
                                root: {
                                    fontSize: FontSizes.small
                                }
                            }}
                        >
                            {isWidgetAvailable(
                                widget.data.type as WidgetType
                            ) ? (
                                widget.description
                            ) : (
                                <>
                                    {widget.notAvailableDescription}{' '}
                                    <Link
                                        target="_blank"
                                        href={widget.learnMoreLink}
                                    >
                                        {t('learnMore')}
                                    </Link>
                                </>
                            )}
                        </Text>
                    </Stack>
                </Stack>
            </DefaultButton>
        ),
        [
            scenePageContext?.state.adxConnectionInformation?.loadingState,
            isWidgetAvailable,
            isSpinnerVisible,
            selectedWidget,
            enabledWidgets
        ]
    );

    return (
        <Dialog
            dialogContentProps={dialogContentProps}
            modalProps={modalProps}
            hidden={false}
            onDismiss={() => setIsLibraryDialogOpen(false)}
        >
            <div className="cb-widget-library-dialog-list-container">
                <List
                    items={filteredAvailableWidgets}
                    onRenderCell={handleOnRenderCell}
                    version={scenePageContext?.state.adxConnectionInformation}
                ></List>
                <div className="cb-widget-panel-clear-float" />
            </div>
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
