import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    DatasourceType,
    IBehavior,
    ITwinToObjectMapping,
    IWidget,
    VisualType
} from '../../../../Models/Classes/3DVConfig';
import { ADT3DSceneBuilderMode } from '../../../../Models/Constants/Enums';
import {
    BehaviorSaveMode,
    IADT3DSceneBuilderBehaviorFormProps
} from '../ADT3DSceneBuilder.types';
import produce from 'immer';
import { PrimaryButton } from '@fluentui/react/lib/components/Button/PrimaryButton/PrimaryButton';
import { Pivot } from '@fluentui/react/lib/components/Pivot/Pivot';
import { PivotItem } from '@fluentui/react/lib/components/Pivot/PivotItem';
import { ColorPicker } from '@fluentui/react/lib/components/ColorPicker/ColorPicker';
import {
    ActionButton,
    DefaultButton,
    Dialog,
    DialogFooter,
    DialogType,
    Dropdown,
    FontIcon,
    IconButton,
    IContextualMenuItem,
    IContextualMenuProps,
    IDialogContentProps,
    IModalProps,
    Label,
    List,
    SearchBox,
    TextField
} from '@fluentui/react';

const defaultBehavior: IBehavior = {
    id: '',
    type: 'Behavior',
    layers: ['PhysicalProperties'],
    datasources: [],
    visuals: [
        {
            type: VisualType.ColorChange,
            color: {
                type: 'BindingExpression',
                expression: ''
            },
            elementIDs: {
                type: 'MeshIDArray',
                expression: 'meshIDs'
            },
            label: null,
            isHorizontal: false,
            title: '',
            widgets: []
        }
    ],
    twinAliases: []
};

enum BehaviorPivot {
    elements = 'elements',
    twins = 'twins',
    alerts = 'alerts',
    widgets = 'widgets'
}

const SceneBehaviorsForm: React.FC<IADT3DSceneBuilderBehaviorFormProps> = ({
    elements,
    builderMode,
    selectedBehavior,
    onBehaviorBackClick,
    onBehaviorSave,
    setSelectedMeshIds
}) => {
    const { t } = useTranslation();

    const [behaviorToEdit, setBehaviorToEdit] = useState<IBehavior>(
        Object.keys(selectedBehavior as any).length === 0
            ? defaultBehavior
            : selectedBehavior
    );

    const [
        selectedBehaviorPivotKey,
        setSelectedBehaviorPivotKey
    ] = useState<BehaviorPivot>(BehaviorPivot.elements);

    const [originalBehaviorId, setOriginalBehaviorId] = useState(
        selectedBehavior?.id
    );

    const colorSelectedElements = (
        elementsToColor: Array<ITwinToObjectMapping>
    ) => {
        const meshIds = [].concat(...elementsToColor.map((etc) => etc.meshIDs));
        setSelectedMeshIds(meshIds);
    };

    useEffect(() => {
        // Color selected meshes
        const selectedElements = [];

        behaviorToEdit.datasources
            .filter((ds) => ds.type === DatasourceType.TwinToObjectMapping)
            .forEach((ds) => {
                ds.mappingIDs.forEach((mappingId) => {
                    const element = elements.find((el) => el.id === mappingId);
                    element && selectedElements.push(element);
                });
            });

        if (selectedElements?.length > 0) {
            colorSelectedElements(selectedElements);
        }
        // Save original Id
        setOriginalBehaviorId(selectedBehavior.id);
    }, []);

    return (
        <div className="cb-scene-builder-left-panel-create-wrapper">
            <div className="cb-scene-builder-left-panel-create-form">
                <div
                    className="cb-scene-builder-left-panel-create-form-header"
                    tabIndex={0}
                    onClick={() => {
                        onBehaviorBackClick();
                        setSelectedMeshIds([]);
                    }}
                >
                    <FontIcon
                        iconName={'ChevronRight'}
                        className="cb-chevron cb-breadcrumb"
                    />
                    <span>
                        {builderMode !== ADT3DSceneBuilderMode.CreateBehavior
                            ? t('3dSceneBuilder.editBehavior')
                            : t('3dSceneBuilder.newBehavior')}
                    </span>
                </div>
                <div className="cb-scene-builder-left-panel-create-form-contents">
                    <TextField
                        label={t('3dSceneBuilder.behaviorId')}
                        value={behaviorToEdit.id}
                        required
                        onChange={(_e, newValue) => {
                            setBehaviorToEdit(
                                produce((draft) => {
                                    draft.id = newValue.replace(/\s/g, '');
                                })
                            );
                        }}
                    />

                    <Pivot
                        selectedKey={selectedBehaviorPivotKey}
                        onLinkClick={(item) =>
                            setSelectedBehaviorPivotKey(
                                item.props.itemKey as BehaviorPivot
                            )
                        }
                        styles={{
                            root: { marginLeft: -8, marginBottom: 8 }
                        }}
                    >
                        <PivotItem
                            headerText={t('3dSceneBuilder.elements')}
                            itemKey={BehaviorPivot.elements}
                        >
                            <BehaviorFormElementsTab
                                behaviorToEdit={behaviorToEdit}
                                elements={elements}
                                setBehaviorToEdit={setBehaviorToEdit}
                                colorSelectedElements={colorSelectedElements}
                            />
                        </PivotItem>
                        <PivotItem
                            headerText={t('3dSceneBuilder.alerts')}
                            itemKey={BehaviorPivot.alerts}
                        >
                            <BehaviorFormAlertsTab
                                behaviorToEdit={behaviorToEdit}
                                setBehaviorToEdit={setBehaviorToEdit}
                            />
                        </PivotItem>
                        <PivotItem
                            headerText={t('3dSceneBuilder.widgets')}
                            itemKey={BehaviorPivot.widgets}
                        >
                            <BehaviorFormWidgetsTab
                                behaviorToEdit={behaviorToEdit}
                                setBehaviorToEdit={setBehaviorToEdit}
                            />
                        </PivotItem>
                    </Pivot>
                </div>
            </div>
            <div className="cb-scene-builder-left-panel-create-form-actions">
                <PrimaryButton
                    onClick={() => {
                        onBehaviorSave(
                            behaviorToEdit,
                            builderMode as BehaviorSaveMode,
                            originalBehaviorId
                        );
                        onBehaviorBackClick();
                        setSelectedMeshIds([]);
                    }}
                    text={
                        builderMode === ADT3DSceneBuilderMode.CreateBehavior
                            ? t('create')
                            : t('update')
                    }
                    disabled={!behaviorToEdit?.id}
                />
            </div>
        </div>
    );
};

const BehaviorFormElementsTab: React.FC<{
    behaviorToEdit: IBehavior;
    setBehaviorToEdit: React.Dispatch<React.SetStateAction<IBehavior>>;
    elements: Array<ITwinToObjectMapping>;
    colorSelectedElements: (
        elementsToColor: Array<ITwinToObjectMapping>
    ) => any;
}> = ({
    behaviorToEdit,
    setBehaviorToEdit,
    elements,
    colorSelectedElements
}) => {
    const { t } = useTranslation();

    return (
        <Dropdown
            label={t('3dSceneBuilder.behaviorElementsDropdownLabel')}
            selectedKey={
                behaviorToEdit?.datasources?.[0]?.mappingIDs?.[0] ?? undefined
            }
            onChange={(_ev, option) => {
                setBehaviorToEdit(
                    produce((draft) => {
                        // v1 datasources set to single TwinToObjectMappingDatasource
                        draft.datasources = [
                            {
                                type: DatasourceType.TwinToObjectMapping,
                                mappingIDs: [option.id], // v1 mappingIDs set to single element
                                messageFilter: '',
                                twinFilterQuery: '',
                                twinFilterSelector: ''
                            }
                        ];
                    })
                );

                // Color selected element mesh in scene
                const selectedElement = elements.find(
                    (el) => el.id === option.id
                );
                selectedElement && colorSelectedElements([selectedElement]);
            }}
            placeholder={t(
                '3dSceneBuilder.behaviorElementsDropdownPlaceholder'
            )}
            options={elements.map((el) => ({
                key: el.id,
                text: el.displayName,
                id: el.id,
                data: el
            }))}
        />
    );
};

const BehaviorFormAlertsTab: React.FC<{
    behaviorToEdit: IBehavior;
    setBehaviorToEdit: React.Dispatch<React.SetStateAction<IBehavior>>;
}> = ({ behaviorToEdit, setBehaviorToEdit }) => {
    const { t } = useTranslation();

    let colorAlertTriggerExpression = '';
    const colorChangeVisual = behaviorToEdit.visuals.find(
        (visual) => visual.type === VisualType.ColorChange
    );
    if (colorChangeVisual) {
        colorAlertTriggerExpression = colorChangeVisual.color.expression;
    }

    const [color, setColor] = useState('#FF0000');

    return (
        <>
            <TextField
                label={t('3dSceneBuilder.behaviorTriggerLabel')}
                multiline={colorAlertTriggerExpression.length > 50}
                onChange={(_e, newValue) => {
                    setBehaviorToEdit(
                        produce((draft) => {
                            // Assuming only 1 color change visual per behavior
                            const colorChangeVisual = draft.visuals.find(
                                (visual) =>
                                    visual.type === VisualType.ColorChange
                            );
                            colorChangeVisual.color.expression = newValue;
                        })
                    );
                }}
                value={colorAlertTriggerExpression}
                placeholder={t('3dSceneBuilder.behaviorTriggerPlaceholder')}
            />
            <ColorPicker
                alphaType={'none'}
                color={color}
                onChange={(_ev, color) => setColor(color.hex)}
            />
        </>
    );
};

const availableWidgets = [
    {
        type: 'Trend',
        description: 'widgets.trendDescription',
        iconName: 'HistoricalWeather',
        data: {
            type: 'Trend',
            controlConfiguration: {}
        }
    },
    {
        type: 'Gauge',
        description: 'widgets.gaugeDescription',
        iconName: 'SpeedHigh',
        data: {
            type: 'Gauge',
            controlConfiguration: {
                valueBreakPoints: [100, 200, 500],
                units: 'PSI',
                colors: ['#FDCD4D', '#00D700', '#ff0000'],
                expression: 'primaryTwin.OutFlow',
                label: 'Left'
            }
        }
    },
    {
        type: 'Link',
        description: 'widgets.linkDescription',
        iconName: 'Link',
        data: {
            type: 'Link',
            controlConfiguration: {
                expression: 'https://mypowerbi.biz/${primaryTwin.$dtId}'
            }
        }
    },
    {
        type: 'Panel',
        description: 'widgets.panelDescription',
        iconName: 'ViewAll2',
        data: {
            type: 'Panel',
            controlConfiguration: {}
        }
    }
];

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

export default SceneBehaviorsForm;

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
